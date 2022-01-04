import { Component, OnInit } from '@angular/core';
import { SocketService } from '@app/services/sockets/socket.service';

@Component({
    selector: 'app-reset-system-data',
    templateUrl: './reset-system-data.component.html',
    styleUrls: ['./reset-system-data.component.scss'],
})
export class ResetSystemDataComponent implements OnInit {
    constructor(private socketService: SocketService) {}

    async ngOnInit(): Promise<void> {
        this.socketService.socket.on('resetDone', () => {
            alert('Données du système réinitialisées');
            this.socketService.socket.emit('info');
        });
    }

    resetData(): void {
        this.socketService.socket.emit('resetData');
        return;
    }
}
