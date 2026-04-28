"use strict";
var AudioGraph;
(function (AudioGraph) {
    var ƒ = FudgeCore;
    window.addEventListener("click", start);
    let nodes = [];
    let nodeControlled;
    async function start(_event) {
        window.removeEventListener("click", start);
        window.addEventListener("keydown", handleKeydown);
        let audioMario = new ƒ.Audio("Sound/mario_piano.mp3");
        let audioTrancy = new ƒ.Audio("Sound/trancyvania.mp3");
        let audioHypno = new ƒ.Audio("Sound/hypnotic.mp3");
        // await audioHypno.asyncLoad("Sound/hypnotic.mp3");
        for (let i = 0; i < 10; i++)
            nodes.push(new ƒ.Node("Node" + i));
        let cmpAudio = new ƒ.ComponentAudio(audioHypno, true, true);
        cmpAudio.mtxPivot.translateX(2);
        nodes[0].addComponent(cmpAudio);
        cmpAudio = new ƒ.ComponentAudio(audioTrancy, true, true);
        cmpAudio.mtxPivot.translateX(-2);
        nodes[1].addComponent(cmpAudio);
        cmpAudio = new ƒ.ComponentAudio(audioMario, true, true);
        cmpAudio.mtxPivot.translateX(0);
        nodes[2].addComponent(cmpAudio);
        nodeControlled = nodes[0];
        ƒ.AudioManager.default.listenTo(nodes[0]);
        log();
    }
    function log() {
        ƒ.Debug.group(`Listening to ${ƒ.AudioManager.default.getGraphListeningTo().name}, controlling ${nodeControlled.name}`);
        for (let node of nodes) {
            let out = `node: ${node.name}`;
            if (node.getParent())
                out += ` [child of ${node.getParent().name}]`;
            let cmpAudioList = node.getComponents(ƒ.ComponentAudio);
            for (let cmpAudio of cmpAudioList)
                out += ` | ComponentAudio is active: ${cmpAudio.isActive}, listened: ${cmpAudio.isListened}, attached: ${cmpAudio.isAttached}`;
            ƒ.Debug.log(out);
        }
        ƒ.Debug.groupEnd();
    }
    function handleKeydown(_event) {
        let cmpAudio = nodeControlled.getComponent(ƒ.ComponentAudio);
        if (_event.code >= ƒ.KEYBOARD_CODE.ZERO && _event.code <= ƒ.KEYBOARD_CODE.NINE)
            nodeControlled = nodes[_event.keyCode - 48];
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.A:
                if (cmpAudio) {
                    cmpAudio.activate(!cmpAudio.isActive);
                    // cmpAudio.play(cmpAudio.isActive);
                }
                break;
            case ƒ.KEYBOARD_CODE.P:
                let parent = parseInt(prompt("Enter the number of the node that will become the parent", "0"));
                if (parent < 0 || parent > 9)
                    throw (new Error("Index out of bounds"));
                nodes[parent].addChild(nodeControlled);
                break;
            case ƒ.KEYBOARD_CODE.C:
                if (!cmpAudio)
                    throw (new Error("No ComponentAudio attached"));
                let container = parseInt(prompt("Enter the number of the node the component attaches to", "0"));
                if (container < 0 || container > 9)
                    throw (new Error("Index out of bounds"));
                nodes[container].addComponent(cmpAudio);
                break;
            case ƒ.KEYBOARD_CODE.L:
                ƒ.AudioManager.default.listenTo(nodeControlled);
                break;
            case ƒ.KEYBOARD_CODE.U:
                ƒ.AudioManager.default.update();
                break;
        }
        log();
    }
})(AudioGraph || (AudioGraph = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJhbmNoTWl4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQnJhbmNoTWl4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFVBQVUsQ0FzRm5CO0FBdEZELFdBQVUsVUFBVTtJQUNsQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDckIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7SUFDekIsSUFBSSxjQUFzQixDQUFDO0lBRzNCLEtBQUssVUFBVSxLQUFLLENBQUMsTUFBYTtRQUNoQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxVQUFVLEdBQVksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDL0QsSUFBSSxXQUFXLEdBQVksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDaEUsSUFBSSxVQUFVLEdBQVksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDNUQsb0RBQW9EO1FBR3BELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJDLElBQUksUUFBUSxHQUFxQixJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5RSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNo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