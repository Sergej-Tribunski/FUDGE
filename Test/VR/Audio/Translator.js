"use strict";
var AudioSceneVR;
(function (AudioSceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(AudioSceneVR); // Register the namespace to FUDGE for serialization
    class Translator extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = f.Component.registerSubclass(Translator); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
                        f.Loop.start();
                        break;
                    case "componentRemove" /* f.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.hasToTurn = false;
            this.isTranslating = false;
            this.update = (_event) => {
                if (this.isTranslating) {
                    if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x < 8.1 && !this.hasToTurn) {
                        this.node.mtxLocal.translateX(0.01);
                        if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x > 8)
                            this.hasToTurn = true;
                    }
                    else if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x > -8.1 && this.hasToTurn) {
                        this.node.mtxLocal.translateX(-0.01);
                        if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.x < -8)
                            this.hasToTurn = false;
                    }
                }
            };
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    AudioSceneVR.Translator = Translator;
})(AudioSceneVR || (AudioSceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQTJEckI7QUEzREQsV0FBVSxZQUFZO0lBQ3BCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUUsb0RBQW9EO0lBRXRHLE1BQWEsVUFBVyxTQUFRLENBQUMsQ0FBQyxlQUFlO1FBQy9DLHVFQUF1RTtpQkFDaEQsY0FBUyxHQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEFBQW5ELENBQW9EO1FBS3BGO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFMVixnR0FBZ0c7WUFDekYsWUFBTyxHQUFXLGlDQUFpQyxDQUFDO1lBZ0IzRCxpRUFBaUU7WUFDMUQsYUFBUSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3hDLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQjt3QkFDRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQix1Q0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN6RCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUdmLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxDQUFDLG1CQUFtQiw2Q0FBd0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMvRCxJQUFJLENBQUMsbUJBQW1CLG1EQUEyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2xFLE1BQU07b0JBQ1I7d0JBQ0UsZ0hBQWdIO3dCQUNoSCxNQUFNO2dCQUNWLENBQUM7WUFDSCxDQUFDLENBQUE7WUFDTyxjQUFTLEdBQVksS0FBSyxDQUFDO1lBQzVCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1lBQzlCLFdBQU0sR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUN2QyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDOzRCQUN6RSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDMUIsQ0FBQzt5QkFDSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDdEcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3JDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUMxRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDM0IsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFBO1lBM0NDLHFDQUFxQztZQUNyQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDakMsT0FBTztZQUVULGlFQUFpRTtZQUNqRSxJQUFJLENBQUMsZ0JBQWdCLDZDQUF3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixtREFBMkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxnQkFBZ0IscURBQTRCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRSxDQUFDOztJQWxCVSx1QkFBVSxhQXNEdEIsQ0FBQTtBQUNILENBQUMsRUEzRFMsWUFBWSxLQUFaLFlBQVksUUEyRHJCIn0=