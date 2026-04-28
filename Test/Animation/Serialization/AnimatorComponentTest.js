"use strict";
var AnimatorComponentTest;
(function (AnimatorComponentTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("DOMContentLoaded", init);
    let viewport;
    function init() {
        let root = new ƒ.Node("Root");
        viewport = ƒAid.Viewport.create(root);
        document.body.addEventListener("change", createTest);
        createTest();
    }
    async function createTest() {
        console.log("%cStart over", "color: red;");
        let root = new ƒ.Node("Root");
        let node;
        node = new ƒAid.Node("Test", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("Texture", ƒ.ShaderLitTextured, new ƒ.CoatTextured()), new ƒ.MeshCube("Cube"));
        root.appendChild(node);
        viewport.setBranch(root);
        viewport.draw();
        let animseq = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, 0), new ƒ.AnimationKey(5000, 45)], Number);
        let animStructure = {
            components: {
                ComponentTransform: [
                    {
                        mtxLocal: {
                            rotation: {
                                x: animseq,
                                y: animseq
                            }
                        }
                    }
                ]
            }
        };
        let animation = new ƒ.Animation("testAnimation", animStructure, 1);
        animation.labels["test"] = 2000;
        animation.setEvent("event", 3000);
        let cmpAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE.LOOP, ƒ.ANIMATION_QUANTIZATION.CONTINOUS);
        cmpAnimation.scale = 2;
        // #region serialisation
        console.groupCollapsed("Animation");
        let serialisation = animation.serialize();
        console.log("Animation", ƒ.Serializer.stringify(serialisation));
        console.groupEnd();
        console.groupCollapsed("Serialization");
        console.log(cmpAnimation);
        serialisation = cmpAnimation.serialize();
        let txtOriginal = ƒ.Serializer.stringify(serialisation);
        console.log("ComponentAnimation original", txtOriginal);
        console.groupEnd();
        console.groupCollapsed("Reconstruction");
        let cmpAnimationReconstructed = new ƒ.ComponentAnimation();
        await cmpAnimationReconstructed.deserialize(serialisation);
        // console.log(cmpAnimationReconstructed);
        serialisation = cmpAnimationReconstructed.serialize();
        let txtReconstruction = ƒ.Serializer.stringify(serialisation);
        console.log(txtReconstruction);
        console.groupEnd();
        // #endregion
        if (txtOriginal == txtReconstruction)
            console.log("Serialization strings of original and reconstruction match");
        else
            console.error("Serialization strings of original and reconstruction don't match");
        let formdata = new FormData(document.forms[0]);
        if (formdata.get("use") == "reconstruction")
            cmpAnimation = cmpAnimationReconstructed;
        cmpAnimation.addEventListener("event", hndlEv);
        if (formdata.get("jump"))
            cmpAnimation.addEventListener("event", (_event) => cmpAnimation.jumpTo(animation.labels["test"]));
        node.addComponent(cmpAnimation);
        cmpAnimation.activate(true);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, frame);
        ƒ.Loop.start();
        if (formdata.get("destroy") == "detach")
            console.log(new ƒ.Timer(ƒ.Time.game, 8000, 1, () => node.removeComponent(cmpAnimation)));
        if (formdata.get("destroy") == "remove")
            console.log(new ƒ.Timer(ƒ.Time.game, 8000, 1, () => root.removeChild(node)));
    }
    function frame() {
        viewport.draw();
    }
    function hndlEv(_e) {
        console.log("Event handled", _e);
    }
})(AnimatorComponentTest || (AnimatorComponentTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0b3JDb21wb25lbnRUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQW5pbWF0b3JDb21wb25lbnRUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLHFCQUFxQixDQXNHOUI7QUF0R0QsV0FBVSxxQkFBcUI7SUFDN0IsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLElBQU8sSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUN2QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEQsSUFBSSxRQUFvQixDQUFDO0lBRXpCLFNBQVMsSUFBSTtRQUNYLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckQsVUFBVSxFQUFFLENBQUM7SUFDZixDQUFDO0lBR0QsS0FBSyxVQUFVLFVBQVU7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDM0MsSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksSUFBWSxDQUFDO1FBQ2pCLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxD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