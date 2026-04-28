"use strict";
var ParticleSystemTest;
(function (ParticleSystemTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Project.registerScriptNamespace(ParticleSystemTest);
    let viewport;
    window.addEventListener("load", init);
    async function init() {
        let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        await ƒ.Project.loadResourcesFromHTML();
        let graph = ƒ.Project.resources[graphId];
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.dispatchEvent(new CustomEvent("start"));
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        function update(_event) {
            viewport.draw();
        }
    }
    class ParticleSystemController extends ƒ.ComponentScript {
        static { this.iSubclass = ƒ.Component.registerSubclass(ParticleSystemController); }
        #cmpParticleSystem;
        constructor() {
            super();
            this.dependencyNames = "";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        ƒ.Loop.addEventListener("start", this.start);
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.start = (_event) => {
                this.#cmpParticleSystem = this.node.getComponent(ƒ.ComponentParticleSystem);
                let activation = document.getElementById(this.node.name.toLocaleLowerCase());
                let size = document.getElementById(this.node.name.toLocaleLowerCase() + "size");
                activation.checked = this.node.isActive;
                size.value = this.#cmpParticleSystem.size.toString();
                activation.onchange = (_event) => {
                    this.node.activate(activation.checked);
                    size.hidden = !activation.checked;
                    this.dependencies.forEach(_node => _node.activate(activation.checked));
                };
                size.onchange = (_event) => {
                    this.#cmpParticleSystem.size = size.valueAsNumber;
                };
                activation.dispatchEvent(new Event("change"));
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        get dependencies() {
            let dependencies = [];
            let root = this.node?.getAncestor();
            if (!root)
                return dependencies;
            for (let name of this.dependencyNames.split(", ")) {
                let dependency;
                for (let descendant of root) {
                    if (descendant.name == name) {
                        dependency = descendant;
                        break;
                    }
                }
                if (dependency)
                    dependencies.push(dependency);
            }
            return dependencies;
        }
    }
    ParticleSystemTest.ParticleSystemController = ParticleSystemController;
})(ParticleSystemTest || (ParticleSystemTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsa0JBQWtCLENBbUgzQjtBQW5IRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBTyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBRXZCLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUV0RCxJQUFJLFFBQW9CLENBQUM7SUFDekIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV0QyxLQUFLLFVBQVUsSUFBSTtRQUNqQixJQUFJLE9BQU8sR0FBVyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3RixNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN4QyxJQUFJLEtBQUssR0FBcUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1gsS0FBSyxDQUFDLDBGQUEwRixDQUFDLENBQUM7WUFDbEcsT0FBTztRQUNULENBQUM7UUFFRCxxQkFBcUI7UUFDckIsSUFBSSxTQUFTLEdBQXNCLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNELElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixRQUFRLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLFFBQVEs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