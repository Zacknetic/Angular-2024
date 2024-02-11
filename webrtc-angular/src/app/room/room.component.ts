import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
	selector: 'app-room',
	standalone: true,
	imports: [],
	templateUrl: './room.component.html',
	styleUrl: './room.component.css',
})
// implements OnInit
export class RoomComponent {
	@ViewChild('localVideo')
	localVideo!: ElementRef<HTMLVideoElement>;
	@ViewChild('remoteVideo')
	remoteVideo!: ElementRef<HTMLVideoElement>;
	private peerConnection!: RTCPeerConnection;
	private signaling!: WebSocket;

	constructor() {}

	ngOnInit(): void {
		this.initializePeerConnection();
		this.setupSignaling();
	}
	private initializePeerConnection(): void {
		this.peerConnection = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // Example STUN server
		});

		this.peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				this.signaling.send(
					JSON.stringify({ type: 'candidate', candidate: event.candidate })
				);
			}
		};

		this.peerConnection.ontrack = (event) => {
			if (event.streams.length > 0) {
				this.remoteVideo.nativeElement.srcObject = event.streams[0];
				console.log('Stream added to remote video');
			} else {
				console.log('No streams');
			}
		};
	}

	private setupSignaling(): void {
		this.signaling = new WebSocket('wss://192.168.50.12:3000');
		this.signaling.onmessage = (messageEvent) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const text = reader.result as string;
				const data = JSON.parse(text);
				console.log('Received message:', data);

				switch (data.type) {
					case 'offer':
						this.handleOffer(data.offer);
						break;
					case 'answer':
						this.handleAnswer(data.answer);
						break;
					case 'candidate':
						this.handleCandidate(data.candidate);
						break;
					default:
						break;
				}
			};

			// Read the blob as text
			reader.readAsText(messageEvent.data);
		};
	}

	async startCapture(): Promise<void> {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		this.localVideo.nativeElement.srcObject = stream;
		this.localVideo.nativeElement.muted = true;
		stream
			.getTracks()
			.forEach((track) => this.peerConnection.addTrack(track, stream));
	}

	joinRoom(roomName: string): void {
		this.startCapture()
			.then(() => {
				this.peerConnection
					.createOffer()
					.then((offer) => {
						this.peerConnection.setLocalDescription(offer);
						this.signaling.send(
							JSON.stringify({ type: 'offer', offer: offer, roomName })
						);
					})
					.catch((error) => console.error('Error creating an offer', error));
			})
			.catch((error) => console.error('Error starting capture', error));
	}

	private handleOffer(offer: RTCSessionDescriptionInit): void {
		this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
		this.peerConnection.createAnswer().then((answer) => {
			this.peerConnection.setLocalDescription(answer);
			this.signaling.send(JSON.stringify({ type: 'answer', answer: answer }));
		});
	}

	private handleAnswer(answer: RTCSessionDescriptionInit): void {
		this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
	}

	private handleCandidate(candidate: RTCIceCandidateInit | undefined): void {
		this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
	}
}
