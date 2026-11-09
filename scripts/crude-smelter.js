Events.on(EventType.ModContentLoadEvent, () => {
    const smelter = Vars.content.block(
        "mekanized-crude-smelter"
    );

    smelter.buildType = prov(() =>
        new JavaAdapter(
            GenericCrafter.GenericCrafterBuild,
            {},
            smelter
        )
    );

    print("Crude Smelter building type assigned!");
});