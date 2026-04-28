"use strict";
var RenderRendering;
(function (RenderRendering) {
    var ƒ = FudgeCore;
    let map = new ƒ.FramingComplex();
    let frame = new ƒ.Rectangle(0, 0, 100, 100);
    let uiMap;
    /*  let crc2: CanvasRenderingContext2D; */
    window.addEventListener("load", init);
    function init() {
        /*  let canvas: HTMLCanvasElement = document.querySelector("canvas");
         crc2 = canvas.getContext("2d"); */
        let menu = document.querySelector("div[name=menu]");
        uiMap = new UI.FramingComplex();
        menu.appendChild(uiMap);
        uiMap.addEventListener("input", hndChange);
        uiMap.set({ Anchor: map.margin, Border: map.padding });
        let uiRectangle = new UI.Rectangle("Frame");
        uiRectangle.addEventListener("input", hndChange);
        menu.appendChild(uiRectangle);
        uiRectangle.set(frame);
        uiMap.set({ Result: map.getRect(frame) });
    }
    function hndChange(_event) {
        let target = _event.currentTarget;
        setValues(target);
    }
    function setValues(_uiSet) {
        let type = _uiSet.constructor.name;
        if (type == "Rectangle") {
            frame = _uiSet.get();
        }
        else {
            let value = _uiSet.get();
            for (let key in value) {
                switch (key) {
                    case "Margin":
                        map.margin = value[key];
                        break;
                    case "Padding":
                        map.padding = value[key];
                        break;
                    case "Result":
                        break;
                    default:
                        throw (new Error("Invalid name: " + _uiSet.name));
                }
            }
        }
        uiMap.set({ Result: map.getRect(frame) });
        /*  drawRect(map.getRect(frame)); */
    }
    /*  function drawRect(_rect: ƒ.Rectangle): void {
         crc2.clearRect(0, 0, crc2.canvas.width, crc2.canvas.height)
         crc2.strokeRect(_rect.position.x, _rect.position.y, _rect.size.x, _rect.size.y);
     } */
})(RenderRendering || (RenderRendering = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwUmVjdGFuZ2xlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1hcFJlY3RhbmdsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsZUFBZSxDQXNFeEI7QUF0RUQsV0FBVSxlQUFlO0lBQ3JCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFJLEdBQUcsR0FBcUIsSUFBSSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7SUFFbkQsSUFBSSxLQUFLLEdBQWdCLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6RCxJQUFJLEtBQXdCLENBQUM7SUFDOUIsMENBQTBDO0lBRXpDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFdEMsU0FBUyxJQUFJO1FBRVY7MkNBQ21DO1FBRWxDLElBQUksSUFBSSxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFcEUsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXZELElBQUksV0FBVyxHQUFpQixJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUQsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlCLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUU5QyxDQUFDO0lBRUQsU0FBUyxTQUFTLENBQUMsTUFBYTtRQUM1QixJQUFJLE1BQU0sR0FBNkIsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUU1RCxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEIsQ0FBQztJQUVELFNBQVMsU0FBUyxDQUFDLE1BQW1CO1FBQ2xDLElBQUksSUFBSSxHQUFXLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQzNDLElBQUksSUFBSSxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3RCLEtBQUssR0FBZ0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3RDLENBQUM7YUFDSSxDQUFDO1lBQ0YsSUFBSSxLQUFLLEdBQU8sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTdCLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBRXBCLFFBQVEsR0FBRyxFQUFFLENBQUM7b0JBQ1YsS0FBSyxRQUFRO3dCQUNULEdBQUcsQ0FBQyxNQUFNLEdBQWEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNsQyxNQUFNO29CQUNWLEtBQUssU0FBUzt3QkFDVixHQUFHLENBQUMsT0FBTyxHQUFhLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDbkMsTUFBTTtvQkFDVixLQUFLLFFBQVE7d0JBQ1QsTUFBTTtvQkFDVjt3QkFDSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFELENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0Msb0NBQW9DO0lBQ3ZDLENBQUM7SUFFRjs7O1NBR0s7QUFDUixDQUFDLEVBdEVTLGVBQWUsS0FBZixlQUFlLFFBc0V4QiJ9