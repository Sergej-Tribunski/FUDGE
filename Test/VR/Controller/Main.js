"use strict";
var ControllerSceneVR;
(function (ControllerSceneVR) {
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let xrViewport = new f.XRViewport();
    let graph = null;
    let cmpVRDevice = null;
    window.addEventListener("load", init);
    async function init() {
        await FudgeCore.Project.loadResources("Internal.json");
        graph = f.Project.resources[document.head.querySelector("meta[autoView]").getAttribute("autoView")];
        FudgeCore.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        let canvas = document.querySelector("canvas");
        cmpVRDevice = graph.getChildrenByName("Camera")[0].getComponent(f.ComponentVRDevice);
        cmpVRDevice.clrBackground = f.Color.CSS("lightsteelblue", 0.25);
        xrViewport.initialize("Viewport", graph, cmpVRDevice, canvas);
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST);
        checkForVRSupport();
    }
    // check device/browser capabilities for XR Session 
    function checkForVRSupport() {
        navigator.xr.isSessionSupported(f.XR_SESSION_MODE.IMMERSIVE_VR).then((supported) => {
            if (supported)
                setupVR();
            else
                console.log("Session not supported");
        });
    }
    //main function to start XR Session
    function setupVR() {
        //create XR Button -> Browser 
        let enterXRButton = document.createElement("button");
        enterXRButton.id = "xrButton";
        enterXRButton.innerHTML = "Enter VR";
        enterXRButton.style.position = "absolute";
        enterXRButton.style.zIndex = "1000";
        document.body.appendChild(enterXRButton);
        enterXRButton.addEventListener("click", async function () {
            //initalizes xr session 
            if (!xrViewport.session) {
                await xrViewport.initializeVR(f.XR_SESSION_MODE.IMMERSIVE_VR, f.XR_REFERENCE_SPACE.LOCAL, true);
                xrViewport.session.addEventListener("end", onEndSession);
            }
            initializeController();
            //stop normal loop of winodws.animationFrame
            f.Loop.stop();
            //starts xr-session.animationFrame instead of window.animationFrame, your xr-session is ready to go!
            f.Loop.start(f.LOOP_MODE.FRAME_REQUEST_XR);
        });
    }
    function initializeController() {
        let rightCntrl = graph.getChildrenByName("ControllerRight")[0];
        let leftCntrl = graph.getChildrenByName("ControllerLeft")[0];
        rightCntrl.addComponent(new ControllerSceneVR.Controller(xrViewport, xrViewport.vrDevice.rightCntrl));
        leftCntrl.addComponent(new ControllerSceneVR.Controller(xrViewport, xrViewport.vrDevice.leftCntrl));
    }
    function update(_event) {
        xrViewport.draw();
    }
    function onEndSession() {
        f.Loop.stop();
        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST);
    }
    // function onSqueeze(_event: XRInputSourceEvent): void {
    //     if (actualTeleportationObj) {
    //         let newPos: f.Vector3 = f.Vector3.DIFFERENCE(cmpCamera.mtxWorld.translation, actualTeleportationObj.getComponent(f.ComponentTransform).mtxLocal.translation);
    //         newPos.y -= 0.5;
    //         xrViewport.vr.setNewXRRigidtransform(newPos);
    //         actualTeleportationObj.getComponent(f.ComponentMaterial).clrPrimary.a = 0.5;
    //         actualTeleportationObj = null;
    //     }
    // }
    // function onSelectStart(_event: XRInputSourceEvent): void {
    //     if (actualThrowObject) {
    //         if (_event.inputSource.handedness == "right") {
    //             selectPressedRight = true;
    //         }
    //         if (_event.inputSource.handedness == "left") {
    //             selectPressedLeft = true;
    //         }
    //     }
    // }
    // function onSelectEnd(_event: XRInputSourceEvent): void {
    //     if (actualThrowObject) {
    //         if (_event.inputSource.handedness == "right") {
    //             actualThrowObject.getComponent(f.ComponentRigidbody).setVelocity(f.Vector3.ZERO());
    //             let velocity: f.Vector3 = f.Vector3.DIFFERENCE(rightController.mtxLocal.translation, cmpCamera.mtxPivot.translation);
    //             velocity.scale(20);
    //             actualThrowObject.getComponent(f.ComponentRigidbody).addVelocity(velocity);
    //             actualThrowObject.getComponent(f.ComponentMaterial).clrPrimary.a = 0.5;
    //             actualThrowObject = null;
    //             selectPressedRight = false;
    //         } else {
    //             actualThrowObject.getComponent(f.ComponentRigidbody).setVelocity(f.Vector3.ZERO());
    //             let direction: f.Vector3 = f.Vector3.DIFFERENCE(leftController.mtxLocal.translation, cmpCamera.mtxPivot.translation);
    //             direction.scale(20);
    //             actualThrowObject.getComponent(f.ComponentRigidbody).addVelocity(direction);
    //             actualThrowObject.getComponent(f.ComponentMaterial).clrPrimary.a = 0.5;
    //             actualThrowObject = null;
    //             selectPressedLeft = false;
    //         }
    //     }
    // }
})(ControllerSceneVR || (ControllerSceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsaUJBQWlCLENBbUoxQjtBQW5KRCxXQUFVLGlCQUFpQjtJQUN6QixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUUvQyxJQUFJLFVBQVUsR0FBaUIsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbEQsSUFBSSxLQUFLLEdBQVksSUFBSSxDQUFDO0lBQzFCLElBQUksV0FBVyxHQUF3QixJQUFJLENBQUM7SUFDNUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV0QyxLQUFLLFVBQVUsSUFBSTtRQUNqQixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZELEtBQUssR0FBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzdHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWCxLQUFLLENBQUMsMEZBQTBGLENBQUMsQ0FBQztZQUNsRyxPQUFPO1FBQ1QsQ0FBQztRQUNELElBQUksTUFBTSxHQUF5QyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BGLFdBQVcsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JGLFdB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