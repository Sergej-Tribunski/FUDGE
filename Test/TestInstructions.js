"use strict";
var TestInstructions;
(function (TestInstructions) {
    // TODO: extend with form for comment. POST with automatically collected data to https://api.github.com/repos/JirkaDellOro/FUDGE/issues https://api.github.com/repos/hs-furtwangen/FUDGE/issues
    // see: https://developer.github.com/v3/issues/#create-an-issue
    let dialog;
    let closeButton;
    let instructions;
    function display(_instructions, _open = true) {
        instructions = _instructions;
        dialog = document.createElement("dialog");
        dialogPolyfill.registerDialog(dialog);
        dialog.innerHTML += "<small>Press Ctrl+F1 to toggle this dialog</small>";
        window.addEventListener("keyup", handleKeypress);
        for (let key in _instructions) {
            let content = _instructions[key];
            switch (key) {
                case "Name":
                    document.title = content + "|Test";
                    dialog.innerHTML += "<h1>" + content + "</h1";
                    break;
                default:
                    let fieldset = document.createElement("fieldset");
                    let legend = document.createElement("legend");
                    legend.textContent = key;
                    let ul = document.createElement("ul");
                    ul.id = key;
                    for (let element of content)
                        ul.innerHTML += "<li class='dialog'>" + element + "</h1>";
                    fieldset.className = "dialog";
                    ul.className = "dialog";
                    legend.className = "dialog";
                    fieldset.appendChild(legend);
                    fieldset.appendChild(ul);
                    dialog.appendChild(fieldset);
                    break;
            }
            document.body.appendChild(dialog);
            dialog.style.zIndex = "100";
            if (_open)
                //@ts-ignore
                dialog.show();
        }
        dialog.className = "dialog";
        closeButton = document.createElement("div");
        closeButton.classList.add("dialog-button");
        closeButton.innerHTML = `<div class="a"></div><div class="b"></div><div class="c"></div>`;
        document.body.appendChild(closeButton);
        closeButton.classList.add("open");
        closeButton.addEventListener("click", toggleDialog);
        let viewportMeta = document.createElement("meta");
        viewportMeta.name = "viewport";
        viewportMeta.content = "width=device-width, initial-scale=1.0";
        // viewportMeta.outerHTML = `<meta name="viewport" content=>`;
        document.head.appendChild(viewportMeta);
    }
    TestInstructions.display = display;
    function handleKeypress(_event) {
        if (_event.code == "F1" && _event.ctrlKey)
            toggleDialog();
    }
    function toggleDialog() {
        //@ts-ignore
        if (dialog.open) {
            //@ts-ignore
            dialog.close();
            closeButton.classList.remove("open");
        }
        else {
            //@ts-ignore
            dialog.show();
            closeButton.classList.add("open");
        }
    }
    function get(_key) {
        return dialog.querySelector("ul#" + _key);
    }
    TestInstructions.get = get;
})(TestInstructions || (TestInstructions = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdEluc3RydWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRlc3RJbnN0cnVjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsZ0JBQWdCLENBdUZ6QjtBQXZGRCxXQUFVLGdCQUFnQjtJQUN4QiwrTEFBK0w7SUFDL0wsK0RBQStEO0lBTS9ELElBQUksTUFBeUIsQ0FBQztJQUM5QixJQUFJLFdBQTJCLENBQUM7SUFDaEMsSUFBSSxZQUFvQixDQUFDO0lBRXpCLFNBQWdCLE9BQU8sQ0FBQyxhQUFxQixFQUFFLFFBQWlCLElBQUk7UUFDbEUsWUFBWSxHQUFHLGFBQWEsQ0FBQztRQUM3QixNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxTQUFTLElBQUksb0RBQW9ELENBQUM7UUFDekUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVqRCxLQUFLLElBQUksR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQzlCLElBQUksT0FBTyxHQUFzQixhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEQsUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDWixLQUFLLE1BQU07b0JBQ1QsUUFBUSxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDO29CQUNuQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO29CQUM5QyxNQUFNO2dCQUNSO29CQUNFLElBQUksUUFBUSxHQUF3QixRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN2RSxJQUFJLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDakUsTUFBTSxDQUFDLFdBQVcsR0FBRyxHQUFH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