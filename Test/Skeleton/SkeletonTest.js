"use strict";
var SkeletonTest;
(function (SkeletonTest) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    async function init() {
        const canvas = document.querySelector("canvas");
        // setup scene
        const scene = new ƒ.Node("Scene");
        const rotatorX = new ƒ.Node("RotatorX");
        rotatorX.addComponent(new ƒ.ComponentTransform());
        const rotatorY = new ƒ.Node("RotatorY");
        rotatorY.addComponent(new ƒ.ComponentTransform());
        const cylinder = await createAnimatedCylinder();
        console.log(cylinder);
        scene.addChild(rotatorX);
        rotatorX.addChild(rotatorY);
        rotatorY.addChild(cylinder);
        // setup camera
        const camera = new ƒ.Node("Camera");
        camera.addComponent(new ƒ.ComponentCamera());
        camera.addComponent(new ƒ.ComponentTransform());
        camera.getComponent(ƒ.ComponentCamera).clrBackground.setHex("4472C4FF");
        camera.mtxLocal.translateZ(10);
        camera.mtxLocal.lookAt(ƒ.Vector3.ZERO(), camera.mtxLocal.getY());
        scene.addChild(camera);
        // setup light
        const cmpLightDirectional = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.DIRECTIONAL, new ƒ.Color(0.5, 0.5, 0.5));
        cmpLightDirectional.mtxPivot.rotateY(180);
        scene.addComponent(cmpLightDirectional);
        const cmpLightAmbient = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.AMBIENT, new ƒ.Color(0.5, 0.5, 0.5));
        scene.addComponent(cmpLightAmbient);
        // setup viewport
        const viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", scene, camera.getComponent(ƒ.ComponentCamera), canvas);
        viewport.draw();
        console.log(viewport);
        // run loop
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, () => update(viewport, rotatorX.mtxLocal, rotatorY.mtxLocal, cylinder.getComponent(ƒ.ComponentMaterial).material));
        ƒ.Loop.start();
    }
    class MeshSkinCylinder extends ƒ.Mesh {
        static #skeleton;
        constructor() {
            super();
            const meshSource = new ƒ.MeshRotation("MeshRotation", [
                new ƒ.Vector2(0, 4),
                new ƒ.Vector2(1, 4),
                new ƒ.Vector2(1, 3),
                new ƒ.Vector2(1, 2),
                new ƒ.Vector2(1, 1),
                new ƒ.Vector2(1, 0),
                new ƒ.Vector2(0, 0)
            ], 6);
            this.vertices = Reflect.get(meshSource, "vertices");
            this.faces = Reflect.get(meshSource, "faces");
            for (let vertex of this.vertices.originals) {
                let cmpSkeleton = MeshSkinCylinder.skeleton.getComponent(ƒ.ComponentSkeleton);
                vertex.bones = [
                    { index: cmpSkeleton.indexOf("LowerBone"), weight: 1 - vertex.position.y / 4 },
                    { index: cmpSkeleton.indexOf("UpperBone"), weight: vertex.position.y / 4 },
                    { index: 0, weight: 0 },
                    { index: 0, weight: 0 }
                ];
            }
        }
        static get skeleton() {
            if (!this.#skeleton) {
                // setup skeleton with a skeleton transform test
                this.#skeleton = new ƒ.Node("SkeletonCylinder");
                this.#skeleton.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(2))));
                let upperBone = new ƒ.Node("UpperBone");
                upperBone.addComponent(new ƒ.ComponentTransform());
                let lowerBone = new ƒ.Node("LowerBone");
                lowerBone.addComponent(new ƒ.ComponentTransform());
                this.#skeleton.addChild(lowerBone);
                lowerBone.addChild(upperBone);
                let cmpSkeleton = new ƒ.ComponentSkeleton();
                cmpSkeleton.addBone(lowerBone, ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0)));
                cmpSkeleton.addBone(upperBone, ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(-1)));
                this.#skeleton.addComponent(cmpSkeleton);
            }
            return this.#skeleton;
        }
    }
    async function createAnimatedCylinder() {
        const cylinder = new ƒ.Node("CylinderAnimated");
        // skeleton serialization test
        const serialization = ƒ.Serializer.serialize(MeshSkinCylinder.skeleton);
        console.log(serialization);
        const skeleton = await ƒ.Serializer.deserialize(serialization);
        // const skeletonInstance: ƒ.SkeletonInstance = await ƒ.SkeletonInstance.CREATE(skeleton);
        // setup skeleton animator
        const sequenceRotation = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, 0), new ƒ.AnimationKey(1000, 90), new ƒ.AnimationKey(2000, 0)], Number);
        const sequenceScaling = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, 1), new ƒ.AnimationKey(1000, 1.25), new ƒ.AnimationKey(2000, 1)], Number);
        const sequenceTranslation = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, -0.5), new ƒ.AnimationKey(1000, 0.5), new ƒ.AnimationKey(2000, -0.5)], Number);
        const animation = new ƒ.Animation("AnimationSkeletonCylinder", {
            children: {
                LowerBone: {
                    components: {
                        ComponentTransform: {
                            0: {
                                mtxLocal: {
                                    scaling: {
                                        x: sequenceScaling,
                                        y: sequenceScaling,
                                        z: sequenceScaling
                                    },
                                    translation: {
                                        y: sequenceTranslation
                                    }
                                }
                            }
                        }
                    },
                    children: {
                        UpperBone: {
                            components: {
                                ComponentTransform: {
                                    0: {
                                        mtxLocal: {
                                            rotation: {
                                                z: sequenceRotation
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            // mtxBoneLocals: {
            //   UpperBone: {
            //     rotation: {
            //       z: sequenceRotation
            //     }
            //   }
            // },
            // bones: {
            //   LowerBone: {
            //     components: {
            //       ComponentTransform: [
            //         {
            //           mtxLocal: {
            //             scaling: {
            //               x: sequenceScaling,
            //               y: sequenceScaling,
            //               z: sequenceScaling
            //             },
            //             translation: {
            //               y: sequenceTranslation
            //             }
            //           }
            //         }
            //       ]
            //     }
            //   }
            // }
        });
        const cmpAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE.LOOP);
        skeleton.addComponent(cmpAnimation);
        cmpAnimation.activate(true);
        cylinder.addChild(skeleton);
        // setup component mesh
        const mesh = new MeshSkinCylinder();
        const cmpMesh = new ƒ.ComponentMesh(mesh);
        cmpMesh.mtxPivot.translateY(-2);
        cmpMesh.skeleton = skeleton.getComponent(ƒ.ComponentSkeleton);
        cylinder.addComponent(cmpMesh);
        // setup component material 
        const material = new ƒ.Material("MaterialCylinder", ƒ.ShaderFlatSkin, new ƒ.CoatRemissive(ƒ.Color.CSS("White")));
        const cmpMaterial = new ƒ.ComponentMaterial(material);
        cylinder.addComponent(cmpMaterial);
        return cylinder;
    }
    function update(_viewport, _mtxRotatorX, _mtxRotatorY, _material) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            _mtxRotatorY.rotateY(3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP]))
            _mtxRotatorX.rotateX(-3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            _mtxRotatorY.rotateY(-3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN]))
            _mtxRotatorX.rotateX(3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            _mtxRotatorX.copy(ƒ.Matrix4x4.IDENTITY());
            _mtxRotatorY.copy(ƒ.Matrix4x4.IDENTITY());
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.F]))
            _material.setShader(ƒ.ShaderFlatSkin);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G]))
            _material.setShader(ƒ.ShaderGouraudSkin);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.H]))
            _material.setShader(ƒ.ShaderPhongSkin);
        _viewport.draw();
    }
})(SkeletonTest || (SkeletonTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2tlbGV0b25UZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2tlbGV0b25UZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFlBQVksQ0E0TnJCO0FBNU5ELFdBQVUsWUFBWTtJQUNwQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV0QyxLQUFLLFVBQVUsSUFBSTtRQUNqQixNQUFNLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuRSxjQUFjO1FBQ2QsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLE1BQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztRQUVsRCxNQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFFbEQsTUFBTSxRQUFRLEdBQVcsTUFBTSxzQkFBc0IsRUFBRSxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QixRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUIsZUFBZTtRQUNmLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNqRSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZCLGNBQWM7UUFDZCxNQUFNLG1CQUFtQixHQUFxQixJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6SCxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLEtBQUssQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUV4QyxNQUFNLGVBQWUsR0FBcUIsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakgsS0FBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUVwQyxpQkFBaUI7UUFDakIsTUFBTSxRQUFRLEdBQWUsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZGLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLFdBQVc7UUFDWCxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQix1Q0FBcUIsR0FBRyxFQUFFLENBQy9DLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxNQUFNLGdCQUFpQixTQUFRLENBQUMsQ0FBQyxJQUFJO1FBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQVM7UUFFekI7WUFDRSxLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FDM0MsY0FBYyxFQUNkO2dCQUNFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3BCLEVBQ0QsQ0FBQyxDQUNGLENBQUM7WUFFRixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFOUMsS0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUMzQyxJQUFJLFdBQVcsR0FBd0IsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDbkcsTUFBTSxDQUFDLEtBQUssR0FBRztvQkFDYixFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM5RSxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO29CQUN2QixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtpQkFDeEIsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTSxLQUFLLFFBQVE7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDcEIsZ0RBQWdEO2dCQUNoRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0YsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNoRCxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNoRCxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ25DLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRTlCLElBQUksV0FBVyxHQUF3QixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUNqRSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7S0FDRjtJQUVELEtBQUssVUFBVSxzQkFBc0I7UUFDbkMsTUFBTSxRQUFRLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFeEQsOEJBQThCO1FBQzlCLE1BQU0sYUFBYSxHQUFvQixDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFXLENBQUM7UUFDakYsMEZBQTBGO1FBRTFGLDBCQUEwQjtRQUMxQixNQUFNLGdCQUFnQixHQUFnQyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0ssTUFBTSxlQUFlLEdBQWdDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5SyxNQUFNLG1CQUFtQixHQUFnQyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXZMLE1BQU0sU0FBUyxHQUFnQixJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLEVBQUU7WUFDMUUsUUFBUSxFQUFFO2dCQUNSLFNBQVMsRUFBRTtvQkFDVCxVQUFVLEVBQUU7d0JBQ1Ysa0JBQWtCLEVBQUU7NEJBQ2xCLENBQUMsRUFBRTtnQ0FDRCxRQUFRLEVBQUU7b0NBQ1IsT0FBTyxFQUFFO3dDQUNQLENBQUMsRUFBRSxlQUFlO3dDQUNsQixDQUFDLEVBQUUsZUFBZTt3Q0FDbEIsQ0FBQyxFQUFFLGVBQWU7cUNBQ25CO29DQUNELFdBQVcsRUFBRTt3Q0FDWCxDQUFDLEVBQUUsbUJBQW1CO3FDQUN2QjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsU0FBUyxFQUFFOzRCQUNULFVBQVUsRUFBRTtnQ0FDVixrQkFBa0IsRUFBRTtvQ0FDbEIsQ0FBQyxFQUFFO3dDQUNELFFBQVEsRUFBRTs0Q0FDUixRQUFRLEVBQUU7Z0RBQ1IsQ0FBQyxFQUFFLGdCQUFnQjs2Q0FDcEI7eUNBQ0Y7cUNBQ0Y7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELG1CQUFtQjtZQUNuQixpQkFBaUI7WUFDakIsa0JBQWtCO1lBQ2xCLDRCQUE0QjtZQUM1QixRQUFRO1lBQ1IsTUFBTTtZQUNOLEtBQUs7WUFDTCxXQUFXO1lBQ1gsaUJBQWlCO1lBQ2pCLG9CQUFvQjtZQUNwQiw4QkFBOEI7WUFDOUIsWUFBWTtZQUNaLHdCQUF3QjtZQUN4Qix5QkFBeUI7WUFDekIsb0NBQW9DO1lBQ3BDLG9DQUFvQztZQUNwQyxtQ0FBbUM7WUFDbkMsaUJBQWlCO1lBQ2pCLDZCQUE2QjtZQUM3Qix1Q0FBdUM7WUFDdkMsZ0JBQWdCO1lBQ2hCLGNBQWM7WUFDZCxZQUFZO1lBQ1osVUFBVTtZQUNWLFFBQVE7WUFDUixNQUFNO1lBQ04sSUFBSTtTQUNMLENBQUMsQ0FBQztRQUNILE1BQU0sWUFBWSxHQUF5QixJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVCLHVCQUF1QjtRQUN2QixNQUFNLElBQUksR0FBVyxJQUFJLGdCQUFnQixFQUFFLENBQUM7UUFDNUMsTUFBTSxPQUFPLEdBQW9CLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5RCxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLDRCQUE0QjtRQUM1QixNQUFNLFFBQVEsR0FBZSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdILE1BQU0sV0FBVyxHQUF3QixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzRSxRQUFRLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5DLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxTQUFTLE1BQU0sQ0FBQyxTQUFxQixFQUFFLFlBQXlCLEVBQUUsWUFBeUIsRUFBRSxTQUFxQjtRQUNoSCxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNyRCxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMxQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6RixTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQztBQUNILENBQUMsRUE1TlMsWUFBWSxLQUFaLFlBQVksUUE0TnJCIn0=