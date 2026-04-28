"use strict";
var ControllerSceneVR;
(function (ControllerSceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(ControllerSceneVR); // Register the namespace to FUDGE for serialization
    class Controller extends f.ComponentScript {
        constructor(_xrViewport, _controller) {
            super();
            this.xrViewport = null;
            this.aButton = null;
            this.bButton = null;
            this.trigger = null;
            this.select = null;
            this.joyStick = null;
            this.oldaButton = null;
            this.oldbButton = null;
            this.oldtrigger = null;
            this.oldselect = null;
            this.oldjoyStick = null;
            this.mappedButtons = {};
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* f.EVENT.COMPONENT_ADD */:
                        this.initController();
                        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
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
            this.initController = () => {
                this.joyStick = this.node.getChildrenByName("Joystick")[0].getChild(0).getComponent(f.ComponentMesh);
                this.oldjoyStick = this.joyStick.mtxPivot.translation.clone;
                this.aButton = this.node.getChildrenByName("AButton")[0].getComponent(f.ComponentMesh);
                this.oldaButton = this.aButton.mtxPivot.translation.clone;
                this.bButton = this.node.getChildrenByName("BButton")[0].getComponent(f.ComponentMesh);
                this.oldbButton = this.bButton.mtxPivot.translation.clone;
                this.trigger = this.node.getChildrenByName("Trigger")[0].getComponent(f.ComponentMesh);
                this.oldtrigger = this.trigger.mtxPivot.translation.clone;
                this.select = this.node.getChildrenByName("Select")[0].getComponent(f.ComponentMesh);
                this.oldselect = this.select.mtxPivot.translation.clone;
            };
            this.updateController = () => {
                this.node.getComponent(f.ComponentTransform).mtxLocal = this.controller.cmpTransform.mtxLocal;
                this.joyStick.mtxPivot.rotation = new f.Vector3(this.controller.thumbstickX * 25, 0, this.controller.thumbstickY * 25);
                if (this.mappedButtons["select"].pressed)
                    this.select.mtxPivot.translation = new f.Vector3(this.select.mtxPivot.translation.x, this.select.mtxPivot.translation.y, this.oldselect.z + 0.007);
                else
                    this.select.mtxPivot.translation = new f.Vector3(this.select.mtxPivot.translation.x, this.select.mtxPivot.translation.y, this.oldselect.z);
                if (this.mappedButtons["trigger"].pressed)
                    this.trigger.mtxPivot.translation = new f.Vector3(this.trigger.mtxPivot.translation.x, this.trigger.mtxPivot.translation.y, this.oldtrigger.z + 0.008);
                else
                    this.trigger.mtxPivot.translation = new f.Vector3(this.trigger.mtxPivot.translation.x, this.trigger.mtxPivot.translation.y, this.oldtrigger.z);
                if (this.mappedButtons["A"].pressed)
                    this.aButton.mtxPivot.translation = new f.Vector3(this.aButton.mtxPivot.translation.x, this.oldaButton.y - 0.0075, this.aButton.mtxPivot.translation.z);
                else
                    this.aButton.mtxPivot.translation = new f.Vector3(this.aButton.mtxPivot.translation.x, this.oldaButton.y, this.aButton.mtxPivot.translation.z);
                if (this.mappedButtons["B"].pressed)
                    this.bButton.mtxPivot.translation = new f.Vector3(this.bButton.mtxPivot.translation.x, this.oldbButton.y - 0.0075, this.bButton.mtxPivot.translation.z);
                else
                    this.bButton.mtxPivot.translation = new f.Vector3(this.bButton.mtxPivot.translation.x, this.oldbButton.y, this.bButton.mtxPivot.translation.z);
                if (this.mappedButtons["thumbStick"].pressed)
                    this.joyStick.mtxPivot.translation = new f.Vector3(this.joyStick.mtxPivot.translation.x, this.oldjoyStick.y - 0.0075, this.joyStick.mtxPivot.translation.z);
                else
                    this.joyStick.mtxPivot.translation = new f.Vector3(this.joyStick.mtxPivot.translation.x, this.oldjoyStick.y, this.joyStick.mtxPivot.translation.z);
            };
            this.update = () => {
                if (this.xrViewport.session) {
                    try {
                        if (this.mappedButtons["select"])
                            this.updateController();
                        if (!this.mappedButtons["select"])
                            for (let i = 0; i <= 5; i++) {
                                switch (i) {
                                    case (0):
                                        this.mappedButtons["select"] = this.controller.gamePad.buttons[0];
                                        break;
                                    case (1):
                                        this.mappedButtons["trigger"] = this.controller.gamePad.buttons[1];
                                        break;
                                    case (3):
                                        this.mappedButtons["thumbStick"] = this.controller.gamePad.buttons[3];
                                        break;
                                    case (4):
                                        this.mappedButtons["A"] = this.controller.gamePad.buttons[4];
                                        break;
                                    case (5):
                                        this.mappedButtons["B"] = this.controller.gamePad.buttons[5];
                                        break;
                                }
                            }
                    }
                    catch (error) {
                        f.Debug.error("Mapped Buttons are not initialized correctly!");
                    }
                }
            };
            this.xrViewport = _xrViewport;
            this.controller = _controller;
            // Don't start when running in editor
            if (f.Project.mode == f.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* f.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* f.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* f.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    ControllerSceneVR.Controller = Controller;
})(ControllerSceneVR || (ControllerSceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsaUJBQWlCLENBZ0gxQjtBQWhIRCxXQUFVLGlCQUFpQjtJQUN2QixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUUsb0RBQW9EO0lBRTNHLE1BQWEsVUFBVyxTQUFRLENBQUMsQ0FBQyxlQUFlO1FBaUI3QyxZQUFZLFdBQXlCLEVBQUUsV0FBMkI7WUFDOUQsS0FBSyxFQUFFLENBQUM7WUFqQkosZUFBVSxHQUFpQixJQUFJLENBQUM7WUFHaEMsWUFBTyxHQUFvQixJQUFJLENBQUM7WUFDaEMsWUFBTyxHQUFvQixJQUFJLENBQUM7WUFDaEMsWUFBTyxHQUFvQixJQUFJLENBQUM7WUFDaEMsV0FBTSxHQUFvQixJQUFJLENBQUM7WUFDL0IsYUFBUSxHQUFvQixJQUFJLENBQUM7WUFFakMsZUFBVSxHQUFjLElBQUksQ0FBQztZQUM3QixlQUFVLEdBQWMsSUFBSSxDQUFDO1lBQzdCLGVBQVUsR0FBYyxJQUFJLENBQUM7WUFDN0IsY0FBUyxHQUFjLElBQUksQ0FBQztZQUM1QixnQkFBVyxHQUFjLElBQUksQ0FBQztZQUM5QixrQkFBYSxHQUFxQyxFQUFFLENBQUM7WUFnQjdELGlFQUFpRTtZQUMxRCxhQUFRLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDdEMsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2xCO3dCQUNJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFFdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsdUNBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDekQsTUFBTTtvQkFDVjt3QkFDSSxJQUFJLENBQUMsbUJBQW1CLDZDQUF3QixJQUFJLENBQUMs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