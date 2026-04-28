"use strict";
var Graph;
(function (Graph) {
    var ƒ = FudgeCore;
    class AnimateSatellite extends ƒ.ComponentScript {
        // tpo: test performance optimization
        static { this.mtxRotY = ƒ.Matrix4x4.ROTATION_Y(1); }
        static { this.mtxRotX = ƒ.Matrix4x4.ROTATION_X(5); }
        constructor() {
            super();
            this.hndAddComponent = (_event) => {
                this.node.addEventListener("startSatellite", this.start, true);
            };
            this.hndRemoveComponent = (_event) => {
                this.node.removeEventListener("startSatellite", this.start);
                ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            };
            this.start = (_event) => {
                this.mtxLocal = this.node.mtxLocal;
                this.mtxPivot = this.node.getComponent(ƒ.ComponentMesh).mtxPivot;
                this.mtxPivot.translateZ(-0.5);
                this.mtxPivot.scale(ƒ.Vector3.ONE(0.2));
                this.mtxLocal.rotateY(Math.random() * 360);
                ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            };
            this.update = (_event) => {
                // tpo: test performance optimization
                // this.mtxLocal.set(ƒ.Matrix4x4.MULTIPLICATION(this.mtxLocal, AnimateSatellite.mtxRotY));
                // this.mtxPivot.set(ƒ.Matrix4x4.MULTIPLICATION(this.mtxPivot, AnimateSatellite.mtxRotX));
                // :tpo
                this.mtxLocal.rotateY(1);
                this.mtxPivot.rotateX(5);
            };
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndAddComponent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndRemoveComponent);
        }
    }
    Graph.AnimateSatellite = AnimateSatellite;
})(Graph || (Graph = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0ZVNhdGVsbGl0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFuaW1hdGVTYXRlbGxpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsS0FBSyxDQThDZDtBQTlDRCxXQUFVLEtBQUs7SUFDWCxJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsTUFBYSxnQkFBaUIsU0FBUSxDQUFDLENBQUMsZUFBZTtRQUNuRCxxQ0FBcUM7aUJBQ3RCLFlBQU8sR0FBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEFBQXpDLENBQTBDO2lCQUNqRCxZQUFPLEdBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxBQUF6QyxDQUEwQztRQUtoRTtZQUNJLEtBQUssRUFBRSxDQUFDO1lBS1osb0JBQWUsR0FBRyxDQUFDLE1BQWEsRUFBRSxFQUFFO2dCQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFBO1lBRUQsdUJBQWtCLEdBQUcsQ0FBQyxNQUFhLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVELENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLHVDQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFBO1lBRU0sVUFBSyxHQUFHLENBQUMsTUFBYSxFQUFFLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxRQUFRLEdBQXFCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBRXBGLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFFM0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsdUNBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQUE7WUFFTSxXQUFNLEdBQUcsQ0FBQyxNQUFhLEVBQUUsRUFBRTtnQkFDOUIscUNBQXFDO2dCQUNyQywwRkFBMEY7Z0JBQzFGLDBGQUEwRjtnQkFDMUYsT0FBTztnQkFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFBO1lBL0JHLElBQUksQ0FBQyxnQkFBZ0IsNkNBQXdCLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsZ0JBQWdCLG1EQUEyQixJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM3RSxDQUFDOztJQVpRLHNCQUFnQixtQkEwQzVCLENBQUE7QUFDTCxDQUFDLEVBOUNTLEtBQUssS0FBTCxLQUFLLFFBOENkIn0=