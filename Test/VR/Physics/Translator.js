"use strict";
var PhysicsVR;
(function (PhysicsVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(PhysicsVR); // Register the namespace to FUDGE for serialization
    class Translator extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = f.Component.registerSubclass(Translator); }
        // Properties may be mutated by users in the editor via the automatically created user interface
        static { this.speed = 25; }
        constructor() {
            super();
            this.hasHitted = false;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
                        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST, 60);
                        this.addVel();
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
            this.addVel = () => {
                this.node.getComponent(f.ComponentRigidbody).addVelocity(f.Vector3.Z(-Translator.speed));
            };
            this.randomRot = f.Random.default.getRange(-0.5, 0.5);
            this.update = (_event) => {
                if (!this.hasHitted) {
                    this.node.getComponent(f.ComponentRigidbody).rotateBody(f.Vector3.X(-0.5));
                    this.node.getComponent(f.ComponentRigidbody).rotateBody(f.Vector3.Z(this.randomRot));
                    if (this.node.getComponent(f.ComponentTransform).mtxLocal.translation.z > 70 && this.node)
                        PhysicsVR.cubeContainer.removeChild(this.node);
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
    PhysicsVR.Translator = Translator;
})(PhysicsVR || (PhysicsVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsU0FBUyxDQXlEbEI7QUF6REQsV0FBVSxTQUFTO0lBQ2pCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUUsb0RBQW9EO0lBRW5HLE1BQWEsVUFBVyxTQUFRLENBQUMsQ0FBQyxlQUFlO1FBQy9DLHVFQUF1RTtpQkFDaEQsY0FBUyxHQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEFBQW5ELENBQW9EO1FBQ3BGLGdHQUFnRztpQkFDbEYsVUFBSyxHQUFXLEVBQUUsQUFBYixDQUFjO1FBRWpDO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFGSCxjQUFTLEdBQVksS0FBSyxDQUFDO1lBZWxDLGlFQUFpRTtZQUMxRCxhQUFRLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDeEMsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLHVDQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7d0JBRWQsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLENBQUMsbUJBQW1CLDZDQUF3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9ELElBQUksQ0FBQyxtQkFBbUIsbURBQTJCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDbEUsTUFBTTtvQkFDUjt3QkFDRSxnSEFBZ0g7d0JBQ2hILE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQTtZQUNPLFdBQU0sR0FBRyxHQUFTLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRTNGLENBQUMsQ0FBQTtZQUNPLGNBQVMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDakQsV0FBTSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7b0JBQzFFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDckYsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUk7d0JBQ3ZGLFVBQUEsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7WUFFSCxDQUFDLENBQUE7WUExQ0MscUNBQXFDO1lBQ3JDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUNqQyxPQUFPO1lBRVQsaUVBQWlFO1lBQ2pFLElBQUksQ0FBQyxnQkFBZ0IsNkNBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsZ0JBQWdCLG1EQUEyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLGdCQUFnQixxREFBNEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWxFLENBQUM7O0lBbEJVLG9CQUFVLGFBb0R0QixDQUFBO0FBQ0gsQ0FBQyxFQXpEUyxTQUFTLEtBQVQsU0FBUyxRQXlEbEIifQ==