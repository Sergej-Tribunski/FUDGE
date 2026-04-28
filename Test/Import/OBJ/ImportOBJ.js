"use strict";
var ImportOBJTest;
(function (ImportOBJTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
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
        // cmpCamera.clrBackground = ƒ.Color.CSS("SKYBLUE");
        let canvas = document.querySelector("canvas");
        ImportOBJTest.viewport = new ƒ.Viewport();
        ImportOBJTest.viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", ImportOBJTest.viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        // canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        // make the camera interactive (complex method in ƒAid)
        ƒAid.Viewport.expandCameraToInteractiveOrbit(ImportOBJTest.viewport);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        function update(_event) {
            ImportOBJTest.viewport.draw();
        }
    }
})(ImportOBJTest || (ImportOBJTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wb3J0T0JKLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiSW1wb3J0T0JKLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLGFBQWEsQ0F1Q3RCO0FBdkNELFdBQVUsYUFBYTtJQUNyQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBTyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBRXZCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFHdEMsS0FBSyxVQUFVLElBQUk7UUFDakIsSUFBSSxPQUFPLEdBQVcsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0YsNENBQTRDO1FBQzVDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLHlCQUF5QjtRQUN6QixJQUFJLEtBQUssR0FBcUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLEtBQUssQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1lBQ2xHLE9BQU87UUFDVCxDQUFDO1FBQ0QscUJBQXFCO1FBQ3JCLElBQUksU0FBUyxHQUFzQixJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMzRCxvREFBb0Q7UUFDcEQsSUFBSSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakUsY0FBQSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUIsY0FBQSxRQUFRLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGNBQUEsUUFBUSxDQUFDLENBQUM7UUFDbkMsc0VBQXNFO1FBQ3RFLG1FQUFtRTtRQUNuRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGNBQWMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEYsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsOEJBQThCLENBQUMsY0FBQSxRQUFRLENBQUMsQ0FBQztRQUV2RCxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQix1Q0FBcUIsTUFBTSxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVmLFNBQVMsTUFBTSxDQUFDLE1BQWE7WUFDM0IsY0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDLEVBdkNTLGFBQWEsS0FBYixhQUFhLFFBdUN0QiJ9