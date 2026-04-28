"use strict";
var Controls;
(function (Controls) {
    var ƒ = FudgeCore;
    window.addEventListener("DOMContentLoaded", init);
    let controlProportional = new ƒ.Control("Proportional", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
    let controlIntegral = new ƒ.Control("Integral", 0.1, 1 /* ƒ.CONTROL_TYPE.INTEGRAL */);
    let controlDifferential = new ƒ.Control("Differential", 2, 2 /* ƒ.CONTROL_TYPE.DIFFERENTIAL */);
    let input;
    let output;
    let mode;
    let rateDispatchOutput = 20;
    function init(_event) {
        input = document.querySelector("fieldset#Input");
        output = document.querySelector("fieldset#Output");
        mode = document.querySelector("fieldset#Mode");
        setup();
        document.addEventListener("keydown", hndKey);
        document.addEventListener("keyup", hndKey);
        input.addEventListener("input", hndControlInput);
        mode.addEventListener("input", hndModeInput);
        update();
    }
    function setup() {
        let number = { min: "-2", max: "2", step: "0.1", value: "0.1" };
        let slider = { min: "-1", max: "1", step: "0.01", value: "0" };
        let keyboard = createFieldset("Keys A-|D+", true, number, slider, true);
        input.appendChild(keyboard);
        let absolute = createFieldset("Absolute", false, number, slider);
        input.appendChild(absolute);
        number.value = "1";
        let relative = createFieldset("Relative", false, number, slider);
        input.appendChild(relative);
        relative.setAttribute("oldValue", "0");
        let proportional = createFieldset("Proportional", true, number, slider);
        addDelayStepper(proportional);
        output.appendChild(proportional);
        number.value = "0.1";
        let integral = createFieldset("Integral", true, number, slider);
        addDelayStepper(integral);
        output.appendChild(integral);
        number.value = "2";
        let differential = createFieldset("Differential", true, number, slider);
        addDelayStepper(differential);
        output.appendChild(differential);
        controlProportional.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, function (_event) { hndControlOutput(_event, proportional); });
        controlIntegral.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, function (_event) { hndControlOutput(_event, integral); });
        controlDifferential.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, function (_event) { hndControlOutput(_event, differential); });
        proportional.addEventListener("input", function (_event) { hndControlParameters(_event, controlProportional); });
        integral.addEventListener("input", function (_event) { hndControlParameters(_event, controlIntegral); });
        differential.addEventListener("input", function (_event) { hndControlParameters(_event, controlDifferential); });
    }
    function createFieldset(_name, _readonly, _stepper, _slider, _nometer = false) {
        let fieldset = document.createElement("fieldset");
        fieldset.id = _name;
        let legend = document.createElement("legend");
        legend.innerHTML = `<strong>${_name}</strong>Factor: `;
        legend.append(createInputElement("number", _stepper));
        legend.innerHTML += " | Value: [<output>0</output>]";
        if (_readonly && !_nometer)
            legend.innerHTML += " | <meter></meter";
        fieldset.appendChild(legend);
        let slider = createInputElement("range", _slider);
        slider.disabled = _readonly;
        fieldset.append(slider);
        return fieldset;
    }
    function addDelayStepper(_fieldset) {
        _fieldset.querySelector("legend").innerHTML += ` | Delay <input type="number" min="0", max="1000" step="50" value="0" name="Delay"/>`;
    }
    function createInputElement(_type, _parameter) {
        let input = document.createElement("input");
        input.type = _type;
        input.min = _parameter.min;
        input.max = _parameter.max;
        input.step = _parameter.step;
        input.value = _parameter.value;
        input.setAttribute("value", _parameter.value);
        return input;
    }
    function hndKey(_event) {
        if (_event.repeat)
            return;
        if (_event.code != ƒ.KEYBOARD_CODE.A && _event.code != ƒ.KEYBOARD_CODE.D)
            return;
        /* // TODO: integrate sophisticated key handling
    
        let value: number = (_event.code == ƒ.KEYBOARD_CODE.A) ? -1 : 1;
        if (_event.type == "keyup")
          value = 0; */
        let value = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]));
        let slider = document.querySelector("input[type=range");
        slider.value = value.toString();
        slider.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
    function updateFieldsetOutput(_slider) {
        let fieldset = _slider.parentElement;
        let factor = parseFloat(fieldset.querySelector("input").value);
        let value = parseFloat(_slider.value);
        if (fieldset.id == "Relative") {
            let old = parseFloat(fieldset.getAttribute("oldValue"));
            let relative = value - old;
            fieldset.setAttribute("oldValue", value.toString());
            value = relative;
        }
        value *= factor;
        fieldset.querySelector("output").textContent = format(value);
        return value;
    }
    function hndModeInput(_event) {
        let target = document.querySelector("input#Polling");
        rateDispatchOutput = 100;
        if (target.checked) {
            rateDispatchOutput = 0;
            update();
        }
        controlProportional.setRateDispatchOutput(rateDispatchOutput);
        controlDifferential.setRateDispatchOutput(rateDispatchOutput);
        controlIntegral.setRateDispatchOutput(rateDispatchOutput);
    }
    function hndControlInput(_event) {
        let target = _event.target;
        if (target.type != "range")
            return;
        let value = updateFieldsetOutput(target);
        controlProportional.setInput(value);
        controlDifferential.setInput(value);
        controlIntegral.setInput(value);
        let signals = document.querySelector("textarea");
        signals.textContent += target.parentElement.id + ": " + format(value) + "\n";
        signals.scrollTop = signals.scrollHeight;
    }
    function hndControlParameters(_event, _control) {
        let target = _event.target;
        let fieldset = _event.currentTarget;
        let value = parseFloat(target.value);
        if (target.name == "Delay")
            _control.setDelay(value);
        else
            _control.setFactor(value);
    }
    function hndControlOutput(_event, _fieldset) {
        let control = _event.target;
        let slider = _fieldset.querySelector("input[type=range]");
        let value;
        if (_event.detail)
            value = _event.detail.output;
        else
            value = control.getOutput();
        slider.value = value.toString();
        slider.parentElement.querySelector("output").textContent = format(value);
        updateMeter(_fieldset);
    }
    function update() {
        updateMeter(document);
        controlProportional.dispatchEvent(new Event("output" /* ƒ.EVENT_CONTROL.OUTPUT */));
        controlDifferential.dispatchEvent(new Event("output" /* ƒ.EVENT_CONTROL.OUTPUT */));
        controlIntegral.dispatchEvent(new Event("output" /* ƒ.EVENT_CONTROL.OUTPUT */));
        let target = document.querySelector("input#Polling");
        if (target.checked)
            window.setTimeout(update, 10);
    }
    function updateMeter(_ancestor) {
        let meter = _ancestor.querySelector("meter");
        meter.value = (meter.value + 0.01) % 1;
    }
    function format(_value) {
        return _value.toFixed(4).padStart(7, "+");
    }
})(Controls || (Controls = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb250cm9scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxRQUFRLENBZ05qQjtBQWhORCxXQUFVLFFBQVE7SUFDaEIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRCxJQUFJLG1CQUFtQixHQUFjLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztJQUNuRyxJQUFJLGVBQWUsR0FBYyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsa0NBQTBCLENBQUM7SUFDekYsSUFBSSxtQkFBbUIsR0FBYyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsc0NBQThCLENBQUM7SUFFbkcsSUFBSSxLQUEwQixDQUFDO0lBQy9CLElBQUksTUFBMkIsQ0FBQztJQUNoQyxJQUFJLElBQXlCLENBQUM7SUFDOUIsSUFBSSxrQkFBa0IsR0FBVyxFQUFFLENBQUM7SUFJcEMsU0FBUyxJQUFJLENBQUMsTUFBYTtRQUN6QixLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkQsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFL0MsS0FBSyxFQUFFLENBQUM7UUFFUixRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0MsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxlQUFlLENB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