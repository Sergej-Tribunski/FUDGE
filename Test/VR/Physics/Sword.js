"use strict";
var PhysicsVR;
(function (PhysicsVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(PhysicsVR); // Register the namespace to FUDGE for serialization
    class Sword extends f.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = f.Component.registerSubclass(Sword); }
        // Properties may be mutated by users in the editor via the automatically created user interface
        static { this.speed = 15; }
        constructor() {
            super();
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        this.node.getComponent(f.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, this.onColiisionEnter);
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
            this.onColiisionEnter = (_event) => {
                if (_event.cmpRigidbody.node.name == "CubeInstance") {
                    if (_event.cmpRigidbody.node) {
                        _event.cmpRigidbody.node.getComponent(PhysicsVR.Translator).hasHitted = true;
                        _event.cmpRigidbody.setVelocity(f.Vector3.DIFFERENCE(_event.cmpRigidbody.mtxPivot.translation, this.node.mtxLocal.translation));
                        _event.cmpRigidbody.effectGravity = 1;
                        this.removeHittedObject(_event.cmpRigidbody.node);
                    }
                }
            };
            this.removeHittedObject = async (_objectHit) => {
                await f.Time.game.delay(1250);
                PhysicsVR.cubeContainer.removeChild(_objectHit);
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
    PhysicsVR.Sword = Sword;
})(PhysicsVR || (PhysicsVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3dvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxTQUFTLENBeURsQjtBQXpERCxXQUFVLFNBQVM7SUFDakIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBRSxvREFBb0Q7SUFFbkcsTUFBYSxLQUFNLFNBQVEsQ0FBQyxDQUFDLGVBQWU7UUFDMUMsdUVBQXVFO2lCQUNoRCxjQUFTLEdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQUFBOUMsQ0FBK0M7UUFDL0UsZ0dBQWdHO2lCQUNsRixVQUFLLEdBQVcsRUFBRSxBQUFiLENBQWM7UUFFakM7WUFDRSxLQUFLLEVBQUUsQ0FBQztZQWFWLGlFQUFpRTtZQUMxRCxhQUFRLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDeEMsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGdCQUFnQixtRUFBa0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7d0JBR3RILE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxDQUFDLG1CQUFtQiw2Q0FBd0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMvRCxJQUFJLENBQUMsbUJBQW1CLG1EQUEyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2xFLE1BQU07b0JBQ1I7d0JBQ0UsZ0hBQWdIO3dCQUNoSCxNQUFNO2dCQUNWLENBQUM7WUFDSCxDQUFDLENBQUE7WUFDTyxxQkFBZ0IsR0FBRyxDQUFDLE1BQXNCLEVBQVEsRUFBRTtnQkFDMUQsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksY0FBYyxFQUFFLENBQUM7b0JBQ3BELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDN0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQUEsVUFBVSxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzt3QkFDbkUsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7d0JBQ2hJLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQzt3QkFDdEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3BELENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUMsQ0FBQTtZQUNPLHVCQUFrQixHQUFHLEtBQUssRUFBRSxVQUFrQixFQUFpQixFQUFFO2dCQUV2RSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsVUFBQSxhQUFhLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQTtZQTFDQyxxQ0FBcUM7WUFDckMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ2pDLE9BQU87WUFFVCxpRUFBaUU7WUFDakUsSUFBSSxDQUFDLGdCQUFnQiw2Q0FBd0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsbURBQTJCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsZ0JBQWdCLHFEQUE0QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbEUsQ0FBQzs7SUFsQlUsZUFBSyxRQW9EakIsQ0FBQTtBQUNILENBQUMsRUF6RFMsU0FBUyxLQUFULFNBQVMsUUF5RGxCIn0=