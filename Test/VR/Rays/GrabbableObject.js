"use strict";
var RaySceneVR;
(function (RaySceneVR) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(RaySceneVR); // Register the namespace to FUDGE for serialization
    class GrabbableObject extends f.ComponentScript {
        constructor() {
            super();
            // Register the script as component for use in the editor via drag&drop
            this.isGrabbed = false;
        }
    }
    RaySceneVR.GrabbableObject = GrabbableObject;
})(RaySceneVR || (RaySceneVR = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhYmJhYmxlT2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiR3JhYmJhYmxlT2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFVBQVUsQ0FXbkI7QUFYRCxXQUFVLFVBQVU7SUFDaEIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBRSxvREFBb0Q7SUFFcEcsTUFBYSxlQUFnQixTQUFRLENBQUMsQ0FBQyxlQUFlO1FBR2xEO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFIWix1RUFBdUU7WUFDaEUsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUdsQyxDQUFDO0tBQ0o7SUFOWSwwQkFBZSxrQkFNM0IsQ0FBQTtBQUNMLENBQUMsRUFYUyxVQUFVLEtBQVYsVUFBVSxRQVduQiJ9