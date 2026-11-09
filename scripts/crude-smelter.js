Events.on(EventType.ModContentLoadEvent, () => {
    const smelter = Vars.content.block(
        "mekanized-crude-smelter"
    );

    const rawIron = Vars.content.item(
        "mekanized-ox-raw-iron"
    );

    const coal = Vars.content.item(
        "mekanized-ox-coal"
    );

    smelter.buildType = prov(() =>
        new JavaAdapter(
            GenericCrafter.GenericCrafterBuild,
            {
                acceptItem: function(source, item) {
                    return (
                        (item == rawIron || item == coal) &&
                        this.items.total() < smelter.itemCapacity
                    );
                }
            },
            smelter
        )
    );

    print("Crude Smelter input system assigned!");
});