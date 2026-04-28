"use strict";
var AnimatorControleTest;
(function (AnimatorControleTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("DOMContentLoaded", init);
    let node;
    let root;
    let viewport;
    function init() {
        root = new ƒ.Node("Root");
        node = new ƒAid.Node("Test", ƒ.Matrix4x4.IDENTITY(), new ƒ.Material("texture", ƒ.ShaderLitTextured, new ƒ.CoatTextured()), new ƒ.MeshCube("Cube"));
        root.appendChild(node);
        viewport = ƒAid.Viewport.create(root);
        viewport.draw();
        let select = document.querySelector('select[name="mode"]');
        for (let mode in ƒ.ANIMATION_PLAYMODE) {
            let option = document.createElement('option');
            option.value = mode;
            option.text = mode;
            select.appendChild(option);
        }
        select = document.querySelector('select[name="quantization"]');
        for (let mode in ƒ.ANIMATION_QUANTIZATION) {
            let option = document.createElement('option');
            option.value = mode;
            option.text = mode;
            select.appendChild(option);
        }
        initAnim();
        document.body.addEventListener("change", initAnim);
        document.querySelector("button[id=jump]").addEventListener("click", jump);
        function jump(_event) {
            console.log("Jump");
            let cmpAnimation = node.getComponent(ƒ.ComponentAnimation);
            cmpAnimation.jumpToLabel("jump");
        }
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function initAnim() {
        console.log("%cStart over", "color: red;");
        let form = document.forms[0];
        let formData = new FormData(document.forms[0]);
        let time0 = parseInt(form.querySelector("input[name=time0]").value);
        let time1 = parseInt(form.querySelector("input[name=time1]").value);
        let value0 = parseInt(form.querySelector("input[name=value0]").value);
        let value1 = parseInt(form.querySelector("input[name=value1]").value);
        let animseq = new ƒ.AnimationSequence([new ƒ.AnimationKey(time0, value0), new ƒ.AnimationKey(time1, value1)], Number);
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
        let fpsInput = document.querySelector("input[name=fps]");
        let fps = parseInt(fpsInput.value);
        let animation = new ƒ.Animation("testAnimation", animStructure, fps);
        animation.setEvent("event", parseInt(form.querySelector("input[name=event]").value));
        animation.labels["jump"] = parseInt(form.querySelector("input[name=label]").value);
        let playmode = String(formData.get("mode"));
        let quantization = String(formData.get("quantization"));
        let cmpAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE[playmode], ƒ.ANIMATION_QUANTIZATION[quantization]);
        cmpAnimation.scale = 1;
        cmpAnimation.addEventListener("event", (_event) => {
            let time = _event.target.time;
            console.log(`Event fired at ${time}`, _event);
        });
        if (node.getComponent(ƒ.ComponentAnimation)) {
            node.removeComponent(node.getComponent(ƒ.ComponentAnimation));
        }
        node.addComponent(cmpAnimation);
        cmpAnimation.activate(true);
        console.log("Component", cmpAnimation);
    }
    function update() {
        viewport.draw();
    }
})(AnimatorControleTest || (AnimatorControleTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0aW9uVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkFuaW1hdGlvblRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsb0JBQW9CLENBMkc3QjtBQTNHRCxXQUFVLG9CQUFvQjtJQUM1QixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsSUFBTyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQ3ZCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUVsRCxJQUFJLElBQVksQ0FBQztJQUNqQixJQUFJLElBQVksQ0FBQztJQUNqQixJQUFJLFFBQW9CLENBQUM7SUFJekIsU0FBUyxJQUFJO1FBQ1gsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbkosSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhCLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDOUUsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN0QyxJQUFJLE1BQU0sR0FBc0IsUUFBUSxD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