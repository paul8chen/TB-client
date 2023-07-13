import { io } from "socket.io-client";

class SocketService {
	socket;

	connect() {
		this.socket = io(process.env.REACT_APP_SERVER_BASE_URL, {
			transports: ["websocket"],
			secure: true,
		});
		this.listenConnectEvents();
	}

	listenConnectEvents() {
		this.socket.on("connect", () => {
			console.log("connected");
		});

		this.socket.on("disconnect", (reason) => {
			console.log(`Reason: ${reason}`);
			this.socket.connect();
		});

		this.socket.on("connect_error", (error) => {
			console.log(`Error: ${error}`);
			this.socket.connect();
		});
	}
}

export const socketService = new SocketService();
