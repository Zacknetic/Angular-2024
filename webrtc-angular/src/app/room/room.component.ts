import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-room',
	standalone: true,
	imports: [],
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
	@ViewChild('videoGrid') videoGrid!: ElementRef;
	private peerConnections: Map<string, RTCPeerConnection> = new Map();
	private signaling!: WebSocket;
	private localStream!: MediaStream;
	private roomId!: string;
	private userName!: string; // Assume this is set somewhere, e.g., through a dialog

	constructor(private route: ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		this.roomId = this.route.snapshot.paramMap.get('id')!;
		this.userName = prompt('Enter your name', 'User') || 'User'; // Example of setting the userName
		this.setupSignaling();
		this.startCapture();
	}

	ngOnDestroy(): void {
		this.signaling.close();
		this.peerConnections.forEach((pc) => pc.close());
	}

	private setupSignaling(): void {
		this.signaling = new WebSocket('wss://your-websocket-server-url');

		this.signaling.onopen = () => {
			// Join the room right after establishing the WebSocket connection
			this.signaling.send(
				JSON.stringify({
					type: 'join',
					roomId: this.roomId,
					name: this.userName,
				})
			);
		};

		this.signaling.onmessage = async (message) => {
			const data = JSON.parse(message.data);

			switch (data.type) {
				case 'offer':
					await this.handleOffer(data.offer, data.name);
					break;
				case 'answer':
					this.handleAnswer(data.answer, data.name);
					break;
				case 'candidate':
					this.handleCandidate(data.candidate, data.name);
					break;
				case 'user-joined':
					this.prepareConnection(data.name);
					break;
				case 'user-left':
					this.handleUserLeft(data.name);
					break;
				// Handle other message types, such as chat messages or errors
			}
		};
	}

	private prepareConnection(userName: string): void {
		if (userName === this.userName) return; // Ignore self

		const pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		this.localStream.getTracks().forEach((track) => {
			pc.addTrack(track, this.localStream);
		});

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				this.signaling.send(
					JSON.stringify({
						type: 'candidate',
						candidate: event.candidate,
						name: this.userName,
						target: userName,
					})
				);
			}
		};

		pc.ontrack = (event) => {
			if (event.streams && event.streams[0]) {
				this.addVideoStream(event.streams[0], userName);
			}
		};

		this.peerConnections.set(userName, pc);
	}

	leaveRoom(): void {
		this.signaling.send(
			JSON.stringify({
				type: 'leave',
				name: this.userName,
				roomId: this.roomId,
			})
		);
		// Use the router to navigate back to the lobby
		this.router.navigate(['/lobby']);
	}

	private async handleOffer(
		offer: RTCSessionDescriptionInit,
		userName: string
	): Promise<void> {
		if (!this.peerConnections.has(userName)) {
			this.prepareConnection(userName);
		}

		const pc = this.peerConnections.get(userName)!;
		await pc.setRemoteDescription(new RTCSessionDescription(offer));
		const answer = await pc.createAnswer();
		await pc.setLocalDescription(answer);

		this.signaling.send(
			JSON.stringify({
				type: 'answer',
				answer,
				name: this.userName,
				target: userName,
			})
		);
	}

	private handleAnswer(
		answer: RTCSessionDescriptionInit,
		userName: string
	): void {
		const pc = this.peerConnections.get(userName);
		if (pc) {
			pc.setRemoteDescription(new RTCSessionDescription(answer));
		}
	}

	private handleCandidate(
		candidate: RTCIceCandidateInit,
		userName: string
	): void {
		const pc = this.peerConnections.get(userName);
		if (pc && candidate) {
			pc.addIceCandidate(new RTCIceCandidate(candidate));
		}
	}

	private handleUserLeft(userName: string): void {
		const pc = this.peerConnections.get(userName);
		if (pc) {
			pc.close();
			this.peerConnections.delete(userName);
			// Optionally, remove the video element of the user who left
			const videoElement = document.querySelector(`[data-user="${userName}"]`);
			if (videoElement) {
				videoElement.parentElement?.remove();
			}
		}
	}

	private async startCapture(): Promise<void> {
		this.localStream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		this.addVideoStream(this.localStream, this.userName); // Add local stream to the video grid
	}

	private addVideoStream(stream: MediaStream, userName: string): void {
		const videoElement = document.createElement('video');
		videoElement.srcObject = stream;
		videoElement.autoplay = true;
		videoElement.muted = userName === this.userName; // Mute for local user
		videoElement.setAttribute('data-user', userName); // Set a data attribute to identify the user's video

		const nameTag = document.createElement('div');
		nameTag.textContent = userName;
		nameTag.classList.add('video-name-tag');

		const videoContainer = document.createElement('div');
		videoContainer.classList.add('video-container');
		videoContainer.appendChild(videoElement);
		videoContainer.appendChild(nameTag);

		this.videoGrid.nativeElement.appendChild(videoContainer);
	}
}
