"use strict";
var PostprocessingTest;
(function (PostprocessingTest) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
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
        let cmpAmbientOcclusion = new ƒ.ComponentAmbientOcclusion();
        cmpAmbientOcclusion.activate(false);
        cmpCamera.node.addComponent(cmpAmbientOcclusion);
        let cmpBloom = new ƒ.ComponentBloom();
        cmpBloom.activate(false);
        cmpCamera.node.addComponent(cmpBloom);
        let cmpFog = new ƒ.ComponentFog();
        cmpFog.activate(false);
        cmpCamera.node.addComponent(cmpFog);
        let ui = document.getElementById("ui");
        let uiAmbientOcclusion = ƒui.Generator.createDetailsFromMutable(cmpAmbientOcclusion);
        new ƒui.Controller(cmpAmbientOcclusion, uiAmbientOcclusion);
        ui.appendChild(uiAmbientOcclusion);
        let uiBloom = ƒui.Generator.createDetailsFromMutable(cmpBloom);
        new ƒui.Controller(cmpBloom, uiBloom);
        ui.appendChild(uiBloom);
        let uiFog = ƒui.Generator.createDetailsFromMutable(cmpFog);
        new ƒui.Controller(cmpFog, uiFog);
        ui.appendChild(uiFog);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        function update(_event) {
            viewport.draw();
        }
    }
})(PostprocessingTest || (PostprocessingTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsa0JBQWtCLENBa0UzQjtBQWxFRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBTyxHQUFHLEdBQUcsa0JBQWtCLENBQUM7SUFDaEMsSUFBTyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBRXZCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEMsSUFBSSxRQUFvQixDQUFDO0lBRXpCLEtBQUssVUFBVSxJQUFJO1FBQ2pCLElBQUksT0FBTyxHQUFXLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdGLDRDQUE0QztRQUM1QyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3Qyx5QkFBeUI7UUFDekIsSUFBSSxLQUFLLEdBQXFCLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDWCxLQUFLLENBQUMsMEZBQTBGLENBQUMsQ0FBQztZQUNsRyxPQUFPO1FBQ1QsQ0FBQztRQUNELHFCQUFxQjtRQUNyQixJQUFJLFNBQVMsR0FBc0IsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFM0QsSUFBSSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFD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