"use strict";
var StateMachine;
(function (StateMachine) {
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
        JOB[JOB["CHASE"] = 2] = "CHASE";
    })(JOB || (JOB = {}));
    var ƒAid = FudgeAid;
    window.addEventListener("load", start);
    /**
     * Instruction set to be used by StateMachine and ComponentStateMachine for this test.
     * In production code, the instructions are most likely defined within the state machines.
     */
    class GuardInstructions {
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = GuardInstructions.transitDefault;
            setup.actDefault = GuardInstructions.actDefault;
            setup.setTransition(JOB.CHASE, JOB.CHASE, this.transit);
            setup.setAction(JOB.CHASE, this.act);
            return setup;
        }
        static transitDefault(_machine) {
            log(_machine, `Default Transition   ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
        }
        static async actDefault(_machine) {
            log(_machine, `Default Action       ${JOB[_machine.stateCurrent]}`);
            await new Promise(resolve => window.setTimeout(resolve, 1000));
            let random = Math.floor(Math.random() * Object.keys(JOB).length / 2);
            _machine.transit(JOB[JOB[random]]);
            _machine.act();
        }
        static transit(_machine) {
            log(_machine, `Special Transition ! ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
        }
        static async act(_machine) {
            log(_machine, `Special Action     ! ${JOB[_machine.stateCurrent]}`);
            GuardInstructions.actDefault(_machine);
        }
    }
    class Guard extends ƒAid.StateMachine {
        static { this.instructions = GuardInstructions.get(); }
        constructor() {
            super();
            this.instructions = Guard.instructions;
        }
    }
    class ComponentGuard extends ƒAid.ComponentStateMachine {
        static { this.instructions = GuardInstructions.get(); }
        constructor() {
            super();
            this.instructions = ComponentGuard.instructions;
        }
    }
    function start() {
        let guard = new Guard();
        guard.act();
        let cmpGuard = new ComponentGuard();
        cmpGuard.act();
    }
    function log(_machine, _message) {
        let textarea = document.querySelector(`textarea#${_machine.constructor.name}`);
        textarea.value += _message + "\n";
        textarea.scrollTop = textarea.scrollHeight;
    }
})(StateMachine || (StateMachine = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQTZFckI7QUE3RUQsV0FBVSxZQUFZO0lBQ3BCLElBQUssR0FFSjtJQUZELFdBQUssR0FBRztRQUNOLDZCQUFJLENBQUE7UUFBRSxpQ0FBTSxDQUFBO1FBQUUsK0JBQUssQ0FBQTtJQUNyQixDQUFDLEVBRkksR0FBRyxLQUFILEdBQUcsUUFFUDtJQUVELElBQU8sSUFBSSxHQUFHLFFBQVEsQ0FBQztJQUV2QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXZDOzs7T0FHRztJQUNILE1BQU0saUJBQWlCO1FBQ2QsTUFBTSxDQUFDLEdBQUc7WUFDZixJQUFJLEtBQUssR0FBdUMsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUNwRixLQUFLLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDLGNBQWMsQ0FBQztZQUN4RCxLQUFLLENBQUMsVUFBVSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztZQUNoRCxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFTyxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQXNCO1lBQ2xELEdBQUcsQ0FBQyxRQUFRLEVBQUUsd0JBQXdCLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEcsQ0FBQztRQUVPLE1BQU0sQ0FBQyxLQUFLLENBQUMs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