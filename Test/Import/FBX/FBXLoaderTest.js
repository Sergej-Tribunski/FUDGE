"use strict";
var SkeletonTest;
(function (SkeletonTest) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let camera;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.1;
    let cntMouseX = new ƒ.Control("MouseX", speedCameraRotation);
    let cntMouseY = new ƒ.Control("MouseY", speedCameraRotation);
    window.addEventListener("load", init);
    async function init() {
        const loader = await ƒ.FBXLoader.LOAD("./animated_arm.fbx");
        // test loading a mesh
        // console.log(await loader.getMesh(0));
        // load scene
        const graph = await loader.getScene(0);
        console.log(graph);
        // camera setup
        const cmpCamera = new ƒ.ComponentCamera();
        camera = new ƒAid.CameraOrbit(cmpCamera, 15, 80, 1, 20);
        camera.axisRotateX.addControl(cntMouseY);
        camera.axisRotateY.addControl(cntMouseX);
        cmpCamera.clrBackground.setHex("4472C4FF");
        graph.addChild(camera);
        // camera.mtxLocal.translateY(100);
        // let skeleton: ƒ.Node = scene;
        // for (const node of scene)
        //   if (node != scene && node.name == "Skeleton0")
        //     skeleton = node;
        // const meshBone: ƒ.Mesh = new ƒ.MeshRotation(
        //   "bone",
        //   [
        //     new ƒ.Vector2(0, 5),
        //     new ƒ.Vector2(1, 0),
        //     new ƒ.Vector2(0, 0)
        //   ],
        //   3
        // );
        // const materialBone: ƒ.Material = new ƒ.Material("bone", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("green")));
        // for (const bone of skeleton) {
        //   if (bone != skeleton) {
        //     bone.addComponent(new ƒ.ComponentMesh(meshBone));
        //     bone.addComponent(new ƒ.ComponentMaterial(materialBone));
        //     if (bone.getChild(0) /*&& bone.getChild(0).mtxLocal.translation.y >
        //         Math.abs(bone.getChild(0).mtxLocal.translation.x) + Math.abs(bone.getChild(0).mtxLocal.translation.z)*/)
        //       bone.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(bone.getChild(0).mtxLocal.translation.y);
        //   }
        // }
        // for (const node of scene) {
        //   const cmpMaterial: ƒ.ComponentMaterial = node.getComponent(ƒ.ComponentMaterial);
        //   if (cmpMaterial && cmpMaterial.material.name != "bone")
        //     cmpMaterial.activate(false);
        // }
        // test loading all documents and objects
        // loader.fbx.documents.forEach(_document => _document.load());
        // loader.fbx.objects.all.forEach(_object => _object.load());
        // console.log(loader.nodes);
        // console.log(loader.fbx);
        // setup light
        const cmpLightDirectional = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.DIRECTIONAL, new ƒ.Color(0.5, 0.5, 0.5));
        // cmpLightDirectional.mtxPivot.rotateY(180);
        graph.addComponent(cmpLightDirectional);
        const cmpLightAmbient = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.AMBIENT, new ƒ.Color(0.5, 0.5, 0.5));
        graph.addComponent(cmpLightAmbient);
        const viewport = new ƒ.Viewport();
        const canvas = document.querySelector("canvas");
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.canvas.addEventListener("pointermove", hndPointerMove);
        viewport.canvas.addEventListener("wheel", hndWheelMove);
        canvas.addEventListener("mousedown", () => canvas.requestPointerLock());
        canvas.addEventListener("mouseup", () => document.exitPointerLock());
        let timeSpan = document.querySelector('span[is=ui-time]');
        let gPressed = false;
        let iShader = 0;
        const shaders = [ƒ.ShaderFlatSkin, ƒ.ShaderGouraudSkin, ƒ.ShaderPhongSkin];
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start();
        function update(_event) {
            cmpLightDirectional.mtxPivot.rotation = new ƒ.Vector3(0, camera.rotationY + 180, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.P]))
                ƒ.Time.game.setScale(0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W]))
                ƒ.Time.game.setScale(0.1);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S]))
                ƒ.Time.game.setScale(1);
            const setShader = _shader => {
                for (const node of graph) {
                    if (node.getComponent(ƒ.ComponentMaterial))
                        node.getComponent(ƒ.ComponentMaterial).material.setShader(_shader);
                }
            };
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G])) {
                if (!gPressed) {
                    gPressed = true;
                    setShader(shaders[iShader = (iShader + 1) % shaders.length]);
                }
            }
            else
                gPressed = false;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.H]))
                setShader(ƒ.ShaderPhong);
            let cmpAnimation = graph.getComponent(ƒ.ComponentAnimation);
            if (cmpAnimation)
                timeSpan.get = () => cmpAnimation.time.toFixed(0);
            viewport.draw();
            viewport.draw();
        }
    }
    function hndPointerMove(_event) {
        if (!_event.buttons)
            return;
        cntMouseX.setInput(-_event.movementX);
        cntMouseY.setInput(-_event.movementY);
    }
    function hndWheelMove(_event) {
        camera.distance += _event.deltaY * speedCameraTranslation;
    }
})(SkeletonTest || (SkeletonTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRkJYTG9hZGVyVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkZCWExvYWRlclRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQStIckI7QUEvSEQsV0FBVSxZQUFZO0lBQ3BCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLElBQUksR0FBRyxRQUFRLENBQUM7SUFFdkIsSUFBSSxNQUF3QixDQUFDO0lBQzdCLElBQUksbUJBQW1CLEdBQVcsR0FBRyxDQUFDO0lBQ3RDLElBQUksc0JBQXNCLEdBQVcsR0FBRyxDQUFDO0lBQ3pDLElBQUksU0FBUyxHQUFjLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUN4RSxJQUFJLFNBQVMsR0FBYyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFeEUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxLQUFLLFVBQVUsSUFBSTtRQUNqQixNQUFNLE1BQU0sR0FBZ0IsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRXpFLHNCQUFzQjtRQUN0Qix3Q0FBd0M7UUFFeEMsYUFBYTtRQUNiLE1BQU0sS0FBSyxHQUFXLE1BQU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRW5CLGVBQWU7UUFDZixNQUFNLFNBQVMsR0FBc0IsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDN0QsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEQsTUFBTSxD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