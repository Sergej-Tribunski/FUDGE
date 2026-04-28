"use strict";
var RaySceneVR;
(function (RaySceneVR) {
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
        document.body.appendChild(enterXRButton);
        enterXRButton.addEventListener("click", async function () {
            //initalizes xr session 
            if (!xrViewport.session) {
                await xrViewport.initializeVR(f.XR_SESSION_MODE.IMMERSIVE_VR, f.XR_REFERENCE_SPACE.LOCAL, true);
                xrViewport.session.addEventListener("end", onEndSession);
            }
            initializeRays();
            //stop normal loop of winodws.animationFrame
            f.Loop.stop();
            //starts xr-session.animationFrame instead of window.animationFrame, your xr-session is ready to go!
            f.Loop.start(f.LOOP_MODE.FRAME_REQUEST_XR);
        });
    }
    function initializeRays() {
        let pickableObjects = graph.getChildrenByName("CubeContainer")[0];
        let rightRayNode = graph.getChildrenByName("raysContainer")[0].getChild(0);
        let leftRayNode = graph.getChildrenByName("raysContainer")[0].getChild(1);
        rightRayNode.addComponent(new RaySceneVR.RayHelper(xrViewport, xrViewport.vrDevice.rightCntrl, 50, pickableObjects));
        leftRayNode.addComponent(new RaySceneVR.RayHelper(xrViewport, xrViewport.vrDevice.leftCntrl, 50, pickableObjects));
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
})(RaySceneVR || (RaySceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsVUFBVSxDQWlKbkI7QUFqSkQsV0FBVSxVQUFVO0lBQ2xCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBRS9DLElBQUksVUFBVSxHQUFpQixJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNsRCxJQUFJLEtBQUssR0FBWSxJQUFJLENBQUM7SUFDMUIsSUFBSSxXQUFXLEdBQXdCLElBQUksQ0FBQztJQUU1QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXRDLEtBQUssVUFBVSxJQUFJO1FBQ2pCLE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdkQsS0FBSyxHQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDN0csU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLEtBQUssQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1lBQ2xHLE9BQU87UUFDVCxDQUFDO1FBQ0QsSUFBSSxNQUFNLEdBQXlDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEYsV0FBVyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDckYsV0FBVyxD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