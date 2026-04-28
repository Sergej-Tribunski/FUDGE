"use strict";
// /<reference types="../../../../Distribution/FudgeCore.js"/>
var FudgePhysics_Communication;
// /<reference types="../../../../Distribution/FudgeCore.js"/>
(function (FudgePhysics_Communication) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    const app = document.querySelector("canvas");
    let viewPort;
    let hierarchy;
    let fps;
    const times = [];
    let fpsDisplay = document.querySelector("h2#FPS");
    let bodies = new Array();
    let ground;
    let cmpCamera;
    let stepWidth = 0.1;
    let moveableTransform;
    //Joints
    let prismaticJoint;
    let prismaticJointSlide;
    let revoluteJointSwingDoor;
    let cylindricalJoint;
    let sphericalJoint;
    let universalJoint;
    let secondUniversalJoint;
    //Ragdoll
    let head;
    let body1;
    let body2;
    let armL;
    let armR;
    let legL;
    let legR;
    let jointHeadBody;
    let jointUpperLowerBody;
    let jointBodyArmL;
    let jointBodyArmR;
    let jointBodyLegL;
    let jointBodyLegR;
    let holder;
    function init(_event) {
        f.Debug.log(app);
        hierarchy = new f.Node("Scene");
        document.addEventListener("keypress", hndKey);
        document.addEventListener("keydown", hndKeyDown);
        ground = createCompleteMeshNode("Ground", new f.Material("Ground", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.2, 0.2, 0.2, 1))), new f.MeshCube(), 0, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
        let cmpGroundMesh = ground.getComponent(f.ComponentTransform);
        cmpGroundMesh.mtxLocal.scale(new f.Vector3(14, 0.3, 14));
        cmpGroundMesh.mtxLocal.translate(new f.Vector3(0, -1.5, 0));
        hierarchy.appendChild(ground);
        //Prismatic Joints
        bodies[0] = createCompleteMeshNode("Spring_Floor", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.4, 0.4, 0.4, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_2);
        let cmpCubeTransform = bodies[0].getComponent(f.ComponentTransform);
        hierarchy.appendChild(bodies[0]);
        cmpCubeTransform.mtxLocal.translate(new f.Vector3(0, 1, 0));
        cmpCubeTransform.mtxLocal.scaleY(0.2);
        prismaticJoint = new f.JointPrismatic(bodies[0].getComponent(f.ComponentRigidbody), ground.getComponent(f.ComponentRigidbody), new f.Vector3(0, 1, 0));
        bodies[0].addComponent(prismaticJoint);
        prismaticJoint.springDamping = 0;
        prismaticJoint.springFrequency = 1;
        prismaticJoint.maxMotor = 0;
        prismaticJoint.minMotor = 0;
        prismaticJoint.internalCollision = true;
        bodies[3] = createCompleteMeshNode("CubeJointBase", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.4, 0.4, 0.4, 1))), new f.MeshCube(), 1, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[3]);
        bodies[3].mtxLocal.translate(new f.Vector3(-4, 2, -2));
        bodies[3].mtxLocal.scale(new f.Vector3(2, 0.5, 0.5));
        bodies[4] = createCompleteMeshNode("CubeJointSlide", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[4]);
        bodies[4].mtxLocal.translate(new f.Vector3(-4, 2, -2));
        prismaticJointSlide = new f.JointPrismatic(bodies[3].getComponent(f.ComponentRigidbody), bodies[4].getComponent(f.ComponentRigidbody), new f.Vector3(1, 0, 0));
        bodies[3].addComponent(prismaticJointSlide);
        prismaticJointSlide.motorForce = 10; //so it does not slide too much on it's own.
        prismaticJointSlide.minMotor = -1;
        prismaticJointSlide.maxMotor = 1;
        //Revolute Joint
        bodies[5] = createCompleteMeshNode("Handle", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.4, 0.4, 0.4, 1))), new f.MeshCube(), 1, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[5]);
        bodies[5].mtxLocal.translate(new f.Vector3(3.5, 2, -2));
        bodies[5].mtxLocal.scale(new f.Vector3(0.5, 2, 0.5));
        bodies[6] = createCompleteMeshNode("SwingDoor", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[6]);
        bodies[6].mtxLocal.translate(new f.Vector3(4.25, 2, -2));
        bodies[6].mtxLocal.scale(new f.Vector3(1.5, 2, 0.2));
        revoluteJointSwingDoor = new f.JointRevolute(bodies[5].getComponent(f.ComponentRigidbody), bodies[6].getComponent(f.ComponentRigidbody), new f.Vector3(0, 1, 0));
        bodies[5].addComponent(revoluteJointSwingDoor);
        revoluteJointSwingDoor.minMotor = -60;
        revoluteJointSwingDoor.maxMotor = 60;
        //Cylindrical Joint
        bodies[7] = createCompleteMeshNode("Holder", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.4, 0.4, 0.4, 1))), new f.MeshCube(), 1, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[7]);
        bodies[7].mtxLocal.translate(new f.Vector3(1.5, 3, -2));
        bodies[7].mtxLocal.scale(new f.Vector3(0.5, 1, 0.5));
        bodies[8] = createCompleteMeshNode("MovingDrill", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[8]);
        bodies[8].mtxLocal.translate(new f.Vector3(1.5, 2.5, -2));
        bodies[8].mtxLocal.scale(new f.Vector3(0.3, 2, 0.3));
        cylindricalJoint = new f.JointCylindrical(bodies[7].getComponent(f.ComponentRigidbody), bodies[8].getComponent(f.ComponentRigidbody), new f.Vector3(0, 1, 0));
        bodies[7].addComponent(cylindricalJoint);
        cylindricalJoint.minMotor = -1.25;
        cylindricalJoint.rotorSpeed = 1;
        // cylindricalJoint.rotationalMotorTorque = 10;
        cylindricalJoint.rotorTorque = 10;
        //Spherical Joint
        bodies[9] = createCompleteMeshNode("Socket", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.4, 0.4, 0.4, 1))), new f.MeshCube(), 1, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[9]);
        bodies[9].mtxLocal.translate(new f.Vector3(-1.5, 3, 2.5));
        bodies[9].mtxLocal.scale(new f.Vector3(0.5, 0.5, 0.5));
        bodies[10] = createCompleteMeshNode("BallJoint", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[10]);
        bodies[10].mtxLocal.translate(new f.Vector3(-1.5, 2, 2.5));
        bodies[10].mtxLocal.scale(new f.Vector3(0.3, 2, 0.3));
        sphericalJoint = new f.JointSpherical(bodies[9].getComponent(f.ComponentRigidbody), bodies[10].getComponent(f.ComponentRigidbody));
        bodies[9].addComponent(sphericalJoint);
        //Universal Joint
        bodies[11] = createCompleteMeshNode("Holder", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.4, 0.4, 0.4, 1))), new f.MeshCube(), 1, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[11]);
        bodies[11].mtxLocal.translate(new f.Vector3(-5.5, 5, 2.5));
        bodies[11].mtxLocal.scale(new f.Vector3(0.5, 0.5, 0.5));
        bodies[12] = createCompleteMeshNode("Universal1", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[12]);
        bodies[12].mtxLocal.translate(new f.Vector3(-5.5, 3.75, 2.5));
        bodies[12].mtxLocal.scale(new f.Vector3(0.3, 2, 0.3));
        universalJoint = new f.JointUniversal(bodies[11].getComponent(f.ComponentRigidbody), bodies[12].getComponent(f.ComponentRigidbody), new f.Vector3(0, 1, 0), new f.Vector3(1, 0, 0));
        bodies[11].addComponent(universalJoint);
        bodies[13] = createCompleteMeshNode("Universal2", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        hierarchy.appendChild(bodies[13]);
        bodies[13].mtxLocal.translate(new f.Vector3(-5.5, 1.75, 2.5));
        bodies[13].mtxLocal.scale(new f.Vector3(0.3, 2, 0.3));
        secondUniversalJoint = new f.JointUniversal(bodies[12].getComponent(f.ComponentRigidbody), bodies[13].getComponent(f.ComponentRigidbody), new f.Vector3(0, 0, 1), new f.Vector3(1, 0, 0), new f.Vector3(0, -1, 0));
        bodies[12].addComponent(secondUniversalJoint);
        //Miscellaneous
        bodies[1] = createCompleteMeshNode("Cube_2", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        let cmpCubeTransform2 = bodies[1].getComponent(f.ComponentTransform);
        hierarchy.appendChild(bodies[1]);
        cmpCubeTransform2.mtxLocal.translate(new f.Vector3(0, 2, 0));
        bodies[2] = createCompleteMeshNode("Cube_3", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(1, 0, 0, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC);
        let cmpCubeTransform3 = bodies[2].getComponent(f.ComponentTransform);
        hierarchy.appendChild(bodies[2]);
        cmpCubeTransform3.mtxLocal.translate(new f.Vector3(0.5, 3, 0.5));
        bodies[40] = createCompleteMeshNode("Cube_NonePhysics", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0, 1, 1, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC);
        bodies[40].removeComponent(bodies[40].getComponent(f.ComponentRigidbody));
        hierarchy.appendChild(bodies[40]);
        bodies[40].mtxLocal.translate(new f.Vector3(-4.5, 3.5, 0.5));
        //Kinematic
        bodies[3] = createCompleteMeshNode("PlayerControlledCube", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0, 0, 1, 1))), new f.MeshCube(), 1, f.BODY_TYPE.KINEMATIC);
        moveableTransform = bodies[3].getComponent(f.ComponentTransform);
        hierarchy.appendChild(bodies[3]);
        moveableTransform.mtxLocal.translate(new f.Vector3(5, 6, 5));
        //Ragdoll
        createRagdoll();
        let cmpLight = new f.ComponentLight(f.LIGHT_TYPE.DIRECTIONAL, f.Color.CSS("WHITE"));
        cmpLight.mtxPivot.lookAt(new f.Vector3(0.5, -1, -0.8));
        hierarchy.addComponent(cmpLight);
        cmpCamera = new f.ComponentCamera();
        cmpCamera.clrBackground = f.Color.CSS("GREY");
        cmpCamera.mtxPivot.translate(new f.Vector3(0, 2, 17));
        cmpCamera.mtxPivot.lookAt(f.Vector3.ZERO());
        viewPort = new f.Viewport();
        viewPort.initialize("Viewport", hierarchy, cmpCamera, app);
        f.Debug.branch(viewPort.getBranch());
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        viewPort.canvas.addEventListener("pointerdown", hndPointerDown);
        viewPort.canvas.addEventListener("pointerup", hndPointerUp);
        f.Physics.adjustTransforms(hierarchy);
        f.Loop.start();
    }
    function update() {
        f.Physics.simulate();
        viewPort.draw();
        measureFPS();
    }
    function measureFPS() {
        window.requestAnimationFrame(() => {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            fpsDisplay.textContent = "FPS: " + fps.toString();
        });
    }
    function createCompleteMeshNode(_name, _material, _mesh, _mass, _physicsType, _group = f.COLLISION_GROUP.DEFAULT, _colType = f.COLLIDER_TYPE.CUBE) {
        let node = new f.Node(_name);
        let cmpMesh = new f.ComponentMesh(_mesh);
        let cmpMaterial = new f.ComponentMaterial(_material);
        let cmpTransform = new f.ComponentTransform();
        let cmpRigidbody = new f.ComponentRigidbody(_mass, _physicsType, _colType, _group);
        cmpRigidbody.restitution = 0.2;
        cmpRigidbody.friction = 0.8;
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        node.addComponent(cmpRigidbody);
        return node;
    }
    function hndKey(_event) {
        let horizontal = 0;
        let vertical = 0;
        let height = 0;
        if (_event.code == f.KEYBOARD_CODE.A) {
            horizontal -= 1 * stepWidth;
        }
        if (_event.code == f.KEYBOARD_CODE.D) {
            horizontal += 1 * stepWidth;
        }
        if (_event.code == f.KEYBOARD_CODE.W) {
            vertical -= 1 * stepWidth;
        }
        if (_event.code == f.KEYBOARD_CODE.S) {
            vertical += 1 * stepWidth;
        }
        if (_event.code == f.KEYBOARD_CODE.Q) {
            height += 1 * stepWidth;
        }
        if (_event.code == f.KEYBOARD_CODE.E) {
            height -= 1 * stepWidth;
        }
        let pos = moveableTransform.mtxLocal.translation;
        pos.add(new f.Vector3(horizontal, height, vertical));
        moveableTransform.mtxLocal.translation = pos;
    }
    function hndKeyDown(_event) {
        if (_event.code == f.KEYBOARD_CODE.Y) {
            prismaticJoint.bodyAnchor.applyForce(new f.Vector3(0, 1 * 1000, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.U) {
            prismaticJointSlide.bodyTied.applyForce(new f.Vector3(1 * -100, 0, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.I) {
            prismaticJointSlide.bodyTied.applyForce(new f.Vector3(1 * 100, 0, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.O) {
            revoluteJointSwingDoor.bodyTied.applyForce(new f.Vector3(0, 0, 1 * 100));
        }
        if (_event.code == f.KEYBOARD_CODE.P) {
            revoluteJointSwingDoor.bodyTied.applyForce(new f.Vector3(0, 0, 1 * -100));
        }
        if (_event.code == f.KEYBOARD_CODE.F) {
            cylindricalJoint.bodyTied.applyForce(new f.Vector3(0, 1 * 300, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.V) {
            cylindricalJoint.bodyTied.applyTorque(new f.Vector3(0, 1 * 100, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.G) {
            sphericalJoint.bodyTied.applyTorque(new f.Vector3(0, 1 * 100, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.H) {
            secondUniversalJoint.bodyTied.applyForce(new f.Vector3(0, 0, 1 * 100));
        }
        if (_event.code == f.KEYBOARD_CODE.J) {
            secondUniversalJoint.bodyTied.applyTorque(new f.Vector3(0, 1 * 100, 0));
        }
        //Physics Debugs
        if (_event.code == f.KEYBOARD_CODE.M) { //Go through the different modes
            let currentMode = viewPort.physicsDebugMode;
            currentMode = currentMode == 5 ? 0 : viewPort.physicsDebugMode += 1;
            viewPort.physicsDebugMode = currentMode;
        }
    }
    function hndPointerDown(_event) {
        let mouse = new f.Vector2(_event.offsetX, _event.offsetY);
        let posProjection = viewPort.pointClientToProjection(mouse);
        let ray = new f.Ray(new f.Vector3(-posProjection.x, posProjection.y, 1));
        ray.origin.transform(cmpCamera.mtxPivot);
        ray.direction.transform(cmpCamera.mtxPivot, false);
        //Ray
        let hitInfo = f.Physics.raycast(ray.origin, ray.direction, 20);
        if (hitInfo.hit)
            f.Debug.log(hitInfo.rigidbodyComponent.node.name);
        else
            f.Debug.log("miss");
        let pos = hitInfo.hitPoint;
        moveableTransform.mtxLocal.translation = pos;
    }
    function hndPointerUp(_event) {
        //
    }
    function createRagdoll() {
        let pos = new f.Vector3(5, 4, 5);
        let scale = new f.Vector3(0.4, 0.5, 0.4);
        head = createCompleteMeshNode("HeadRD", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 1, 0.3, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1, f.COLLIDER_TYPE.CUBE);
        hierarchy.appendChild(head);
        pos.add(new f.Vector3(0, 0.4, 0));
        head.mtxLocal.translate(pos);
        head.mtxLocal.scale(scale);
        body1 = createCompleteMeshNode("body1", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 1, 0.3, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1, f.COLLIDER_TYPE.CUBE);
        hierarchy.appendChild(body1);
        pos.add(new f.Vector3(0, -0.55, 0));
        scale = new f.Vector3(0.6, 0.6, 0.4);
        body1.mtxLocal.translate(pos);
        body1.mtxLocal.scale(scale);
        body2 = createCompleteMeshNode("body2", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 1, 0.3, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1, f.COLLIDER_TYPE.CUBE);
        hierarchy.appendChild(body2);
        pos.add(new f.Vector3(0, -0.35, 0));
        scale = new f.Vector3(0.4, 0.4, 0.35);
        body2.mtxLocal.translate(pos);
        body2.mtxLocal.scale(scale);
        legL = createCompleteMeshNode("legL", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 1, 0.3, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1, f.COLLIDER_TYPE.CUBE);
        hierarchy.appendChild(legL);
        pos.add(new f.Vector3(-0.25, -0.8, 0));
        scale = new f.Vector3(0.3, 1, 0.3);
        legL.mtxLocal.translate(pos);
        legL.mtxLocal.scale(scale);
        legR = createCompleteMeshNode("legR", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 1, 0.3, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1, f.COLLIDER_TYPE.CUBE);
        hierarchy.appendChild(legR);
        pos.add(new f.Vector3(0.5, 0, 0));
        scale = new f.Vector3(0.3, 1, 0.3);
        legR.mtxLocal.translate(pos);
        legR.mtxLocal.scale(scale);
        armR = createCompleteMeshNode("armR", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 1, 0.3, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1, f.COLLIDER_TYPE.CUBE);
        hierarchy.appendChild(armR);
        pos.add(new f.Vector3(0.45, 1.5, 0));
        scale = new f.Vector3(1, 0.2, 0.2);
        armR.mtxLocal.translate(pos);
        armR.mtxLocal.scale(scale);
        armL = createCompleteMeshNode("armL", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 1, 0.3, 1))), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1, f.COLLIDER_TYPE.CUBE);
        hierarchy.appendChild(armL);
        pos.add(new f.Vector3(-1.45, 0, 0));
        scale = new f.Vector3(1, 0.2, 0.2);
        armL.mtxLocal.translate(pos);
        armL.mtxLocal.scale(scale);
        let x = new f.Vector3(1, 0, 0);
        let y = new f.Vector3(0, 1, 0);
        let z = new f.Vector3(0, 0, 1);
        jointHeadBody = new f.JointRagdoll(head.getComponent(f.ComponentRigidbody), body1.getComponent(f.ComponentRigidbody), y, x, new f.Vector3(0, -0.2, 0));
        jointHeadBody.springFrequencySwing = 10;
        jointHeadBody.springDampingSwing = 1;
        jointHeadBody.maxAngleFirstAxis = 90;
        jointHeadBody.maxAngleSecondAxis = 70;
        jointHeadBody.minMotorTwist = -90;
        jointHeadBody.maxMotorTwist = 90;
        jointHeadBody.springFrequencyTwist = 10;
        jointHeadBody.springDampingTwist = 1;
        head.addComponent(jointHeadBody);
        jointUpperLowerBody = new f.JointRagdoll(body1.getComponent(f.ComponentRigidbody), body2.getComponent(f.ComponentRigidbody), y, x, new f.Vector3(0, -0.4, 0));
        jointUpperLowerBody.springFrequencySwing = 10;
        jointUpperLowerBody.springDampingSwing = 1;
        jointUpperLowerBody.maxAngleFirstAxis = 90;
        jointUpperLowerBody.maxAngleSecondAxis = 90;
        jointUpperLowerBody.minMotorTwist = -90;
        jointUpperLowerBody.maxMotorTwist = 90;
        jointUpperLowerBody.springFrequencyTwist = 10;
        jointUpperLowerBody.springDampingTwist = 1;
        body1.addComponent(jointUpperLowerBody);
        jointBodyArmL = new f.JointRagdoll(armL.getComponent(f.ComponentRigidbody), body1.getComponent(f.ComponentRigidbody), x, z, new f.Vector3(0.5, 0, 0));
        jointBodyArmL.springFrequencySwing = 10;
        jointBodyArmL.springDampingSwing = 1;
        jointBodyArmL.maxAngleFirstAxis = 90;
        jointBodyArmL.maxAngleSecondAxis = 90;
        jointBodyArmL.minMotorTwist = -90;
        jointBodyArmL.maxMotorTwist = 90;
        jointBodyArmL.springFrequencyTwist = 10;
        jointBodyArmL.springDampingTwist = 1;
        armL.addComponent(jointBodyArmL);
        x.x = -1;
        jointBodyArmR = new f.JointRagdoll(armR.getComponent(f.ComponentRigidbody), body1.getComponent(f.ComponentRigidbody), x, z, new f.Vector3(-0.5, 0, 0));
        jointBodyArmR.springFrequencySwing = 10;
        jointBodyArmR.springDampingSwing = 1;
        jointBodyArmR.maxAngleFirstAxis = 90;
        jointBodyArmR.maxAngleSecondAxis = 90;
        jointBodyArmR.minMotorTwist = -90;
        jointBodyArmR.maxMotorTwist = 90;
        jointBodyArmR.springFrequencyTwist = 10;
        jointBodyArmR.springDampingTwist = 1;
        armR.addComponent(jointBodyArmR);
        jointBodyLegL = new f.JointRagdoll(legL.getComponent(f.ComponentRigidbody), body1.getComponent(f.ComponentRigidbody), y, x, new f.Vector3(0, 0.5, 0));
        jointBodyLegL.springFrequencySwing = 10;
        jointBodyLegL.springDampingSwing = 1;
        jointBodyLegL.maxAngleFirstAxis = 90;
        jointBodyLegL.maxAngleSecondAxis = 90;
        jointBodyLegL.minMotorTwist = -90;
        jointBodyLegL.maxMotorTwist = 90;
        jointBodyLegL.springFrequencyTwist = 10;
        jointBodyLegL.springDampingTwist = 1;
        legL.addComponent(jointBodyLegL);
        jointBodyLegR = new f.JointRagdoll(legR.getComponent(f.ComponentRigidbody), body1.getComponent(f.ComponentRigidbody), y, x, new f.Vector3(0, 0.5, 0));
        jointBodyLegR.springFrequencySwing = 10;
        jointBodyLegR.springDampingSwing = 1;
        jointBodyLegR.maxAngleFirstAxis = 90;
        jointBodyLegR.maxAngleSecondAxis = 90;
        jointBodyLegR.minMotorTwist = -90;
        jointBodyLegR.maxMotorTwist = 90;
        jointBodyLegR.springFrequencyTwist = 10;
        jointBodyLegR.springDampingTwist = 1;
        legR.addComponent(jointBodyLegR);
        holder = new f.JointSpherical(moveableTransform.node.getComponent(f.ComponentRigidbody), head.getComponent(f.ComponentRigidbody), new f.Vector3(0, 0, 0));
        moveableTransform.node.addComponent(holder);
        holder.springDamping = 0.1;
        holder.springFrequency = 1;
    }
})(FudgePhysics_Communication || (FudgePhysics_Communication = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhEQUE4RDtBQUM5RCxJQUFVLDBCQUEwQixDQTJjbkM7QUE1Y0QsOERBQThEO0FBQzlELFdBQVUsMEJBQTBCO0lBQ2xDLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sR0FBRyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLElBQUksUUFBb0IsQ0FBQztJQUN6QixJQUFJLFNBQWlCLENBQUM7SUFDdEIsSUFBSSxHQUFXLENBQUM7SUFDaEIsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO0lBQzNCLElBQUksVUFBVSxHQUFnQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRS9ELElBQUksTUFBTSxHQUFhLElBQUksS0FBSyxFQUFFLENBQUM7SUFDbkMsSUFBSSxNQUFjLENBQUM7SUFDbkIsSUFBSSxTQUE0QixDQUFDO0lBRWpDLElBQUksU0FBUyxHQUFXLEdBQUcsQ0FBQztJQUM1QixJQUFJLGlCQUF1QyxDQUFDO0lBRTVDLFFBQVE7SUFDUixJQUFJLGNBQWdDLENBQUM7SUFDckMsSUFBSSxtQkFBcUMsQ0FBQztJQUMxQyxJQUFJLHNCQUF1QyxDQUFDO0lBQzVDLElBQUksZ0JBQW9DLENBQUM7SUFDekMsSUFBSSxjQUFnQyxDQUFDO0lBQ3JDLElBQUksY0FBZ0MsQ0FBQztJQUNyQyxJQUFJLG9CQUFzQyxDQUFDO0lBRTNDLFNBQVM7SUFDVCxJQUFJLElBQVksQ0FBQztJQUNqQixJQUFJLEtBQWEsQ0FBQztJQUNsQixJQUFJLEtBQWEsQ0FBQztJQUNsQixJQUFJLElBQVksQ0FBQztJQUNqQixJQUFJLElBQVksQ0FBQztJQUNqQixJQUFJLElBQVksQ0FBQztJQUNq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QUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM00sU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVyRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsc0JBQXNCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzTSxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JELGdCQUFnQixHQUFHLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlKLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN6QyxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDbEMsZ0JBQWdCLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNoQywrQ0FBK0M7UUFDL0MsZ0JBQWdCLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUVsQyxpQkFBaUI7UUFDakIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM00sU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUV2RCxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxTSxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FB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LEdBQUcsc0JBQXNCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzTixTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUzQixLQUFLLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzTixTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QixLQUFLLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzTixTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FB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QUFDLENBQUMsQ0FBQztRQUNyQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsSUFBSSxHQUFHLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDek4sU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0IsSUFBSSxDQUFDLEdBQWMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFD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