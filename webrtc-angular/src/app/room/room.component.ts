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
	private isLocalStreamReady = false;
	private pendingOffers: any[] = []; // To store incoming offers before the local stream is ready

	constructor(private route: ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		this.roomId = this.route.snapshot.paramMap.get('id')!;
		this.userName = prompt('Enter your name', '') || 'Spock'; // Example of setting the userName
		this.setupSignaling();
		this.startCapture();
	}

	ngOnDestroy(): void {
		this.signaling.close();
		this.peerConnections.forEach((pc) => pc.close());
		this.localStream.getTracks().forEach((track) => track.stop());
	}

	private setupSignaling(): void {
		this.signaling = new WebSocket('wss://192.168.50.12:3000');

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
			console.log('Received message:', data);
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
					if (this.userName !== data.name) {
						// Avoid initiating an offer to self
						this.prepareConnection(data.name);
						this.initiateOffer(data.name);
					}
					break;
				case 'user-left':
					this.handleUserLeft(data.name);
					break;
				// Handle other message types, such as chat messages or errors
			}
		};
	}

	async initiateOffer(userName: string) {
		const pc = this.peerConnections.get(userName);
		if (pc) {
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			this.signaling.send(
				JSON.stringify({
					type: 'offer',
					offer: offer,
					name: this.userName,
					target: userName,
					roomId: this.roomId,
				})
			);
		}
	}

	private prepareConnection(userName: string): void {
		if (userName === this.userName || !this.localStream) {
			console.log('Local stream not ready or attempting to connect to self.');
			return; // Early return if localStream is not ready or attempting to connect to self
		}
		console.log('Preparing connection with', userName);
		const pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		this.localStream.getTracks().forEach((track) => {
			pc.addTrack(track, this.localStream);
		});

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				console.log('Sending ice candidate to', userName);
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
			console.log('Received remote track from', userName);
			if (event.streams && event.streams[0]) {
				this.addVideoStream(event.streams[0], userName);
			} else {
				console.log('No remote stream found');
			}
		};

		pc.oniceconnectionstatechange = (event) => {
			console.log('ICE connection state change:', pc.iceConnectionState);
			console.log('event', event)
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
		console.log('Received offer from', userName);
		if (!this.peerConnections.has(userName)) {
			this.prepareConnection(userName);
		}
		if (!this.isLocalStreamReady) {
			this.pendingOffers.push({ offer, name: userName });
			return;
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
		this.addVideoStream(this.localStream, this.userName, true);
		this.isLocalStreamReady = true;
		this.processPendingOffers();
	}
	private processPendingOffers(): void {
		while (this.pendingOffers.length > 0) {
			const data = this.pendingOffers.shift();
			this.handleOffer(data.offer, data.name);
		}
	}

	private addVideoStream(
		stream: MediaStream,
		userName: string,
		isLocal: boolean = false
	): void {
		const videoElement = document.createElement('video');
		videoElement.srcObject = stream;
		videoElement.autoplay = true;
		videoElement.muted = isLocal; // Mute the video if it's the local user's stream
		videoElement.setAttribute('data-user', userName); // Set a data attribute to identify the user's video

		const nameTag = document.createElement('div');
		nameTag.textContent = userName;
		nameTag.classList.add('video-name-tag');

		const videoContainer = document.createElement('div');
		videoContainer.classList.add(
			isLocal ? 'local-video-container' : 'remote-video-container'
		); // Apply different styling for local and remote videos
		videoContainer.appendChild(videoElement);
		videoContainer.appendChild(nameTag);
		console.log('videoGrid', this.videoGrid);
		this.videoGrid.nativeElement.appendChild(videoContainer);
	}
}
