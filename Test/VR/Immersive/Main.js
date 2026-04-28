"use strict";
var ImmersiveSceneVR;
(function (ImmersiveSceneVR) {
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
        xrViewport.initialize("Viewport", graph, cmpVRDevice, canvas);
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST);
        checkForVRSupport();
    }
    // check device/browser capabilities for XR Session 
    function checkForVRSupport() {
        navigator.xr.isSessionSupported(f.XR_SESSION_MODE.IMMERSIVE_VR).then((_supported) => {
            if (_supported)
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
            //stop normal loop of winodws.animationFrame
            f.Loop.stop();
            //starts xr-session.animationFrame instead of window.animationFrame, your xr-session is ready to go!
            f.Loop.start(f.LOOP_MODE.FRAME_REQUEST_XR);
        });
    }
    function update(_event) {
        // f.Physics.simulate();  // if physics is included and used
        xrViewport.draw();
    }
    function onEndSession() {
        f.Loop.stop();
        f.Loop.start(f.LOOP_MODE.FRAME_REQUEST);
    }
})(ImmersiveSceneVR || (ImmersiveSceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsZ0JBQWdCLENBb0V6QjtBQXBFRCxXQUFVLGdCQUFnQjtJQUN4QixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUUvQyxJQUFJLFVBQVUsR0FBaUIsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbEQsSUFBSSxLQUFLLEdBQVksSUFBSSxDQUFDO0lBQzFCLElBQUksV0FBVyxHQUF3QixJQUFJLENBQUM7SUFDNUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV0QyxLQUFLLFVBQVUsSUFBSTtRQUNqQixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3ZELEtBQUssR0FBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzdHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWCxLQUFLLENBQUMsMEZBQTBGLENBQUMsQ0FBQztZQUNsRyxPQUFPO1FBQ1QsQ0FBQztRQUNELElBQUksTUFBTSxHQUF5QyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BGLFdBQVcsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRXJGLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFHOUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsdUNBQXFCLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFeEMsaUJBQWlCLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBQ0Qsb0RBQW9EO0lBQ3BELFNBQVMsaUJBQWlCO1FBQ3hCLFNBQVMsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFtQixFQUFFLEVBQUU7WUFDM0YsSUFBSSxVQUFVO2dCQUNaLE9BQU8sRUFBRSxDQUFDOztnQkFFVixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsbUNBQW1DO0lBQ25DLFNBQVMsT0FBTztRQUNkLDhCQUE4QjtRQUM5QixJQUFJLGFBQWEsR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RSxhQUFhLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQztRQUM5QixhQUFhLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV6QyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUs7WUFDM0Msd0JBQXdCO1lBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNoRyxVQUFVLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztZQUMzRCxDQUFDO1lBRUQsNENBQTRDO1lBQzVDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxvR0FBb0c7WUFDcEcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FDQSxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsTUFBTSxDQUFDLE1BQWE7UUFDM0IsNERBQTREO1FBQzVELFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBQ0QsU0FBUyxZQUFZO1FBQ25CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7QUFDSCxDQUFDLEVBcEVTLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFvRXpCIn0=