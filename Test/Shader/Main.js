"use strict";
var ShaderTest;
(function (ShaderTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
    let viewport;
    async function init() {
        let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        let graph = ƒ.Project.resources[graphId];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        // canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        // make the camera interactive (complex method in ƒAid)
        ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        function update(_event) {
            viewport.draw();
        }
    }
})(ShaderTest || (ShaderTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsVUFBVSxDQXVDbkI7QUF2Q0QsV0FBVSxVQUFVO0lBQ2xCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLElBQUksR0FBRyxRQUFRLENBQUM7SUFFdkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxJQUFJLFFBQW9CLENBQUM7SUFFekIsS0FBSyxVQUFVLElBQUk7UUFDakIsSUFBSSxPQUFPLEdBQVcsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0YsNENBQTRDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLHlCQUF5QjtRQUN6QixJQUFJLEtBQUssR0FBcUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLEtBQUssQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1lBQ2xHLE9BQU87UUFDVCxDQUFDO1FBQ0QscUJBQXFCO1FBQ3JCLElBQUksU0FBUyxHQUFzQixJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUUzRCxJQUFJLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuQyxzRUFBc0U7UUFDdEUsbUVBQW1FO1FBQ25FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRix1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyw4QkFBOEIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV2RCxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQix1Q0FBcUIsTUFBTSxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVmLFNBQVMsTUFBTSxDQUFDLE1BQWE7WUFDM0IsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2xCLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyxFQXZDUyxVQUFVLEtBQVYsVUFBVSxRQXVDbkIifQ==