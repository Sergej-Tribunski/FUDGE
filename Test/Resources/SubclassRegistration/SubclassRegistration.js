"use strict";
var SubclassRegistration;
(function (SubclassRegistration) {
    var ƒ = FudgeCore;
    // ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL | ƒ.DEBUG_FILTER.SOURCE);
    test(ƒ.Shader);
    test(ƒ.Mesh);
    test(ƒ.Component);
    test(ƒ.Joint);
    function test(_class) {
        console.group(_class.name);
        //@ts-ignore
        for (let subclass of _class.subclasses)
            log(subclass, _class);
        console.groupEnd();
    }
    function log(_class, _baseclass) {
        let instance;
        let color = "black";
        let message = "";
        if (_class["baseClass"] != _baseclass)
            color = "grey";
        try {
            // @ts-ignore
            instance = new _class();
        }
        catch (_error) {
            message = _error.message;
            color = "darkred";
        }
        console.groupCollapsed(`%c${_class.name}`, `color: ${color}`);
        console.dir(_class);
        console.dir(instance);
        if (message)
            console.warn(message);
        console.groupEnd();
    }
})(SubclassRegistration || (SubclassRegistration = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViY2xhc3NSZWdpc3RyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTdWJjbGFzc1JlZ2lzdHJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxvQkFBb0IsQ0FzQzdCO0FBdENELFdBQVUsb0JBQW9CO0lBQzVCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixpRkFBaUY7SUFFakYsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFZCxTQUFTLElBQUksQ0FBQyxNQUFnQjtRQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixZQUFZO1FBQ1osS0FBSyxJQUFJLFFBQVEsSUFBSSxNQUFNLENBQUMsVUFBVTtZQUNwQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUyxHQUFHLENBQUMsTUFBZ0IsRUFBRSxVQUFvQjtRQUNqRCxJQUFJLFFBQWdCLENBQUM7UUFDckIsSUFBSSxLQUFLLEdBQVcsT0FBTyxDQUFDO1FBQzVCLElBQUksT0FBTyxHQUFXLEVBQUUsQ0FBQztRQUN6QixJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxVQUFVO1lBQ25DLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDakIsSUFBSSxDQUFDO1lBQ0gsYUFBYTtZQUNiLFFBQVEsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFBQyxPQUFPLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ3pCLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDcEIsQ0FBQztRQUVELE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixJQUFJLE9BQU87WUFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyQixDQUFDO0FBQ0gsQ0FBQyxFQXRDUyxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBc0M3QiJ9