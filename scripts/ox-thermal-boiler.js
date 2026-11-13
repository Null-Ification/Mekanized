Events.on(EventType.ModContentLoadEvent, () => {
    const boiler = Vars.content.block(
        "mekanized-ox-thermal-boiler"
    );

    const coal = Vars.content.item(
        "mekanized-ox-coal"
    );

    const steam = Vars.content.liquid(
        "mekanized-ox-steam"
    );

    boiler.buildType = prov(() =>
        new JavaAdapter(
            GenericCrafter.GenericCrafterBuild,
            {
                updateTile: function() {
                    this.super$updateTile();
                }
            },
            boiler
        )
    );
});