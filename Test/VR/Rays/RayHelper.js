"use strict";
var RaySceneVR;
(function (RaySceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(RaySceneVR); // Register the namespace to FUDGE for serialization
    class RayHelper extends f.ComponentScript {
        constructor(_xrViewport, _controller, _lengthRay, _cubeContainer) {
            super();
            // Register the script as component for use in the editor via drag&drop
            //  public static readonly iSubclass: number = f.Component.registerSubclass(RayHelper);
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.xrViewport = null;
            this.pick = null;
            this.ray = null;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
                        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST);
                        this.xrViewport.session.addEventListener("squeeze", this.onSqueeze);
                        this.xrViewport.session.addEventListener("selectstart", this.onSelectStart);
                        this.xrViewport.session.addEventListener("selectend", this.onSelectEnd);
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
            this.computeRay = () => {
                if (!this.hasObject) {
                    this.node.getComponent(f.ComponentTransform).mtxLocal = this.controller.cmpTransform.mtxLocal;
                    let forward;
                    forward = f.Vector3.Z();
                    forward.transform(this.node.mtxWorld, false);
                    this.ray = new f.Ray(f.Vector3.SCALE(new f.Vector3(forward.x, forward.y, forward.z), -1000), this.node.mtxLocal.translation, 0.1);
                    if (!this.pick) {
                        this.node.getComponent(f.ComponentMesh).mtxPivot.scaling = new f.Vector3(0.025, this.maxLength, 0.025);
                        this.node.getComponent(f.ComponentMesh).mtxPivot.translation = new f.Vector3(0, 0, -this.maxLength / 2 + 0.2);
                        this.node.getComponent(f.ComponentMaterial).clrPrimary = new f.Color(100, 100, 100, 0.5);
                    }
                    else {
                        let distance = f.Vector3.DIFFERENCE(this.pick.mtxLocal.translation, this.controller.cmpTransform.mtxLocal.translation);
                        this.node.getComponent(f.ComponentMesh).mtxPivot.scaling = new f.Vector3(0.025, distance.magnitude, 0.025);
                        this.node.getComponent(f.ComponentMesh).mtxPivot.translation = new f.Vector3(0, 0, -distance.magnitude / 2 + 0.2);
                        this.node.getComponent(f.ComponentMaterial).clrPrimary = this.pick.getComponent(f.ComponentMaterial).clrPrimary;
                        this.node.getComponent(f.ComponentMaterial).clrPrimary.a = 0.5;
                    }
                    let picker = f.Picker.pickRay(this.pickableObjects, this.ray, 0, 1);
                    picker.sort((a, b) => a.zBuffer < b.zBuffer ? -1 : 1);
                    if (picker.length > 0) {
                        this.pick = picker[0].node;
                    }
                    else
                        this.pick = null;
                }
            };
            this.hasObject = false;
            this.lastPosCntrl = f.Vector3.ZERO();
            this.update = () => {
                if (this.xrViewport.session) {
                    this.computeRay();
                    if (this.hasObject) {
                        let interpolatedDiff = f.Vector3.DIFFERENCE(this.lastPosCntrl, this.controller.cmpTransform.mtxLocal.translation).z;
                        if (this.lastPosCntrl.z < 0)
                            this.pick.mtxLocal.translation = new f.Vector3(0, 0, -this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.y + (interpolatedDiff * 25));
                        else
                            this.pick.mtxLocal.translation = new f.Vector3(0, 0, -this.node.getComponent(f.ComponentMesh).mtxPivot.scaling.y + (-interpolatedDiff * 25));
                        this.pick.mtxLocal.rotation = this.controller.cmpTransform.mtxLocal.rotation;
                    }
                }
            };
            this.onSqueeze = (_event) => {
                if (this.pick) {
                    this.xrViewport.vrDevice.translation = this.pick.getComponent(f.ComponentTransform).mtxLocal.translation;
                }
            };
            this.onSelectStart = (_event) => {
                if (this.pick && !this.pick.getComponent(RaySceneVR.GrabbableObject).isGrabbed) {
                    this.node.addChild(this.pick);
                    this.lastPosCntrl = this.controller.cmpTransform.mtxLocal.translation;
                    this.pick.getComponent(RaySceneVR.GrabbableObject).isGrabbed = true;
                    this.hasObject = true;
                }
            };
            this.onSelectEnd = (_event) => {
                if (this.pick) {
                    this.hasObject = false;
                    this.pick.getComponent(RaySceneVR.GrabbableObject).isGrabbed = false;
                    this.cubeContainer.addChild(this.pick);
                    this.pick.mtxLocal.translation = new f.Vector3(this.pick.mtxWorld.translation.x, this.pick.mtxWorld.translation.y, this.pick.mtxWorld.translation.z);
                    this.pick.mtxLocal.rotation = new f.Vector3(this.pick.mtxWorld.rotation.x, this.pick.mtxWorld.rotation.y, this.pick.mtxWorld.rotation.z);
                }
            };
            this.xrViewport = _xrViewport;
            this.controller = _controller;
            this.maxLength = _lengthRay;
            this.cubeContainer = _cubeContainer;
            this.pickableObjects = _cubeContainer.getChildren();
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    RaySceneVR.RayHelper = RayHelper;
})(RaySceneVR || (RaySceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF5SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUmF5SGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFVBQVUsQ0FnSW5CO0FBaElELFdBQVUsVUFBVTtJQUNoQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFFLG9EQUFvRDtJQUVwRyxNQUFhLFNBQVUsU0FBUSxDQUFDLENBQUMsZUFBZTtRQVk1QyxZQUFZLFdBQXlCLEVBQUUsV0FBMkIsRUFBRSxVQUFrQixFQUFFLGNBQXNCO1lBQzFHLEtBQUssRUFBRSxDQUFDO1lBWlosdUVBQXVFO1lBQ3ZFLHVGQUF1RjtZQUV2RixnR0FBZ0c7WUFDeEYsZUFBVSxHQUFpQixJQUFJLENBQUM7WUFLaEMsU0FBSSxHQUFXLElBQUksQ0FBQztZQUNwQixRQUFHLEdBQVUsSUFBSSxDQUFDO1lBa0IxQixpRUFBaUU7WUFDMUQsYUFBUSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3RDLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNsQjt3QkFDSSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQix1Q0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN6RCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUM1RSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFB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