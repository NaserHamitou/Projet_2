/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketMock } from '@app/classes/socket-test-helper';
import { VP } from '@app/classes/VP';
import { SocketService } from '@app/services/sockets/socket.service';
import { GameOptionsComponent } from '../game-options/game-options.component';
import { AdminPageComponent } from './admin-page.component';
fdescribe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let socketMock: SocketMock;
    /* const vplayer: VP = {
        playerName: 'name',
        level: 'level',
    }; */

    beforeEach(async () => {
        socketMock = new SocketMock();

        const socketService = jasmine.createSpyObj('SocketService', ['initializeSocket'], { isHost: true, socket: socketMock });

        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([{ path: 'home', component: GameOptionsComponent }]), FormsModule],
            declarations: [AdminPageComponent],
            providers: [{ provide: SocketService, useValue: socketService }],
        }).compileComponents();
    });
    beforeEach(async () => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        socketMock.emit('connect', () => {});
        expect(component).toBeTruthy();
    });

    /* it('component should receive VP list from server ', () => {
        component.ngOnInit();
        socketMock.emit('listJV', () => {});
        const spy = spyOn(component.socketService.socket, 'emit');
        component.listJVD.push(vplayer);
        component.listJVE.push(vplayer);
        component.ID_debutant.push(vplayer.playerName);
        component.ID_expert.push(vplayer.playerName);
        expect(component.listJVD.length).toBeGreaterThan(0);
        expect(component.ID_debutant.length).toBeGreaterThan(0);
        expect(component.listJVE.length).toBeGreaterThan(0);
        expect(component.ID_expert.length).toBeGreaterThan(0);
        expect(spy).toHaveBeenCalled();
    }); */

    it('should get all  VP ', () => {
        socketMock.emit('connect', () => {});
        const spy = spyOn(component.socketService.socket, 'emit');
        component.getListJV();
        expect(spy).toHaveBeenCalled();
        expect(component.bestScore).toBe('block');
        expect(component.mainPage).toBe('none');
    });

    it('should add VPD ', () => {
        component.listJVD.push({ playerName: 'name', level: 'debutant' });
        component.addVPD();
        expect(component.listJVD.length).toEqual(1);
    });

    it('should add VPE ', () => {
        component.listJVE.push({ playerName: 'name', level: 'expert' });
        component.addVPE();
        expect(component.listJVE.length).toEqual(1);
    });

    it('should return  true if VPD  list has the target element in VJD ', () => {
        const vp: VP = { playerName: 'name', level: 'expert' };
        component.listJVD.push(vp);
        component.addVPD();
        expect(component.listJVD.includes(vp)).toBeTrue();
    });

    it('should add retun true if VPD  list has the target element in VJE', () => {
        const vp: VP = { playerName: 'name', level: 'expert' };
        component.listJVE.push(vp);
        component.addVPE();
        expect(component.listJVE.includes(vp)).toBeTrue();
    });

    it('should return  true if VPE  list has the target element in VJD ', () => {
        const vp: VP = { playerName: 'name', level: 'expert' };
        component.listJVD.push(vp);
        component.addVPE();
        expect(component.listJVD.includes(vp)).toBeTrue();
    });

    it('should add retun true if VPE  list has the target element in VJE', () => {
        const vp: VP = { playerName: 'name', level: 'expert' };
        component.listJVE.push(vp);
        component.addVPE();
        expect(component.listJVE.includes(vp)).toBeTrue();
    });
    it('should not  delete  the first three  defaut player JVD  ', () => {
        component.listJVD.push({ playerName: 'name1', level: 'debutant' });
        component.listJVD.push({ playerName: 'name2', level: 'debutant' });
        component.listJVD.push({ playerName: 'name3', level: 'debutant' });
        component.deleteVPD(0, component.listJVD[0].playerName);
        component.deleteVPD(1, component.listJVD[1].playerName);
        component.deleteVPD(2, component.listJVD[2].playerName);
        expect(component.listJVD.length).toEqual(3);
    });

    it('should   delete  the   fourth player JVD  ', () => {
        component.listJVD.push({ playerName: 'name1', level: 'debutant' });
        component.listJVD.push({ playerName: 'name2', level: 'debutant' });
        component.listJVD.push({ playerName: 'name3', level: 'debutant' });
        component.listJVD.push({ playerName: 'nametest', level: 'debutant' });
        const index = 3;
        component.deleteVPD(index, component.listJVD[3].playerName);
        expect(component.listJVD.length).toEqual(3);
    });

    it('should not  delete  the first three  defaut player JVE  ', () => {
        component.listJVE.push({ playerName: 'name1', level: 'debutant' });
        component.listJVE.push({ playerName: 'name2', level: 'debutant' });
        component.listJVE.push({ playerName: 'name3', level: 'debutant' });
        component.deleteVPE(0, component.listJVE[0].playerName);
        component.deleteVPE(1, component.listJVE[1].playerName);
        component.deleteVPE(2, component.listJVE[2].playerName);
        expect(component.listJVE.length).toEqual(3);
    });
    it('should   delete  the   fourth player JVE  ', () => {
        component.listJVE.push({ playerName: 'name1', level: 'debutant' });
        component.listJVE.push({ playerName: 'name2', level: 'debutant' });
        component.listJVE.push({ playerName: 'name3', level: 'debutant' });
        component.listJVE.push({ playerName: 'nametest', level: 'debutant' });
        const index = 3;
        component.deleteVPE(index, component.listJVE[3].playerName);
        expect(component.listJVE.length).toEqual(3);
    });
    /*  it('should   change the boolean value JV Expert ', () => {
        const vp: VP = { playerName: 'name', level: 'expert' };
        component.listJVE.push(vp);
        component.listJVE.push({ playerName: 'name2', level: 'expert' });
        component.listJVE.push({ playerName: 'name3', level: 'expert' });
        const index = 3;
        component.updateNameE(index, component.listJVE[2].playerName);
        expect(component.listJVE.includes(vp)).toBeTrue();
        expect(component.isChangedE).toBeTrue();
    }); */
    /* it('should   change the boolean value Debutant  ', () => {
        const vp: VP = { playerName: 'name', level: 'expert' };
        component.listJVD.push(vp);
        component.listJVD.push({ playerName: 'name2', level: 'debutant' });
        component.listJVD.push({ playerName: 'name3', level: 'debutant' });
        const index = 3;
        component.updateNameD(index, component.listJVD[2].playerName);
        component.isChangedD;
        expect(component.listJVD.includes(vp)).toBeTrue();
        expect(component.isChangedD).toBeTrue();
    }); */

    it(' should cancel the update of name JV Debutant ', () => {
        const index = 0;
        component.cancelChangeD(index);
        expect(component.isChangedD[0]).toBeFalse();
    });

    it(' should cancel the update of name JV Expert ', () => {
        const index = 0;
        component.cancelChangeE(index);
        expect(component.isChangedE[0]).toBeFalse();
    });
    /* it('should confirme the the action (changeName) Debutant  ', () => {
        socketMock.emit('connect', () => {});
        const spy = spyOn(component.socketService.socket, 'emit');
        const vp: VP = { playerName: 'name', level: 'Debutant' };

        component.listJVD.push(vp);
        const index = 0;
        const id = 'new ObjectID';

        component.confirmerNameD(index, id);
        socketMock.emit('updatNameD', component.listJVD[0].playerName, id);
        expect(spy).toHaveBeenCalled();
        expect(component.isChangedD[index]).toBeFalse();
    }); */

    /*  it('should confirme the the action (changeName) Expert  ', () => {
        socketMock.emit('connect', () => {});
        const spy = spyOn(component.socketService.socket, 'emit');
        const vp: VP = { playerName: 'name', level: 'Debutant' };

        component.listJVE.push(vp);
        const index = 0;
        const id = 'new ObjectID';

        component.confirmerNameE(index, id);
        socketMock.emit('updatNameE', component.listJVE[0].playerName, id);
        expect(spy).toHaveBeenCalled();
        expect(component.isChangedE[index]).toBeFalse();
    }); */

    it('should  update the VPD name Debutant  ', () => {
        socketMock.emit('connect', () => {});
        const spy = spyOn(component.socketService.socket, 'emit');
        const name = 'nameTest';
        const id = 'new ObjectID';
        component.updateJVD(id, name);
        socketMock.emit('updateJVD', id, name);
        expect(spy).toHaveBeenCalled();
    });

    it('should  update the VPD name  Expert ', () => {
        socketMock.emit('connect', () => {});
        const spy = spyOn(component.socketService.socket, 'emit');
        const name = 'nameTest';
        const id = 'new ObjectID';
        component.updateJVE(id, name);
        socketMock.emit('updateJVE', id, name);
        expect(spy).toHaveBeenCalled();
    });
});
