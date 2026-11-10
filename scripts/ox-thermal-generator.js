Events.on(EventType.ModContentLoadEvent, () => {
    const generator = Vars.content.block(
        "mekanized-ox-thermal-generator"
    );

    const coal = Vars.content.item(
        "mekanized-ox-coal"
    );

    generator.buildType = prov(() =>
        new JavaAdapter(
            ThermalGenerator.ThermalGeneratorBuild,
            {
                fuelTimer: 0,

                updateTile: function() {
                    this.super$updateTile();

                    this.fuelTimer += Time.delta;

                    if (this.fuelTimer >= 60) {
                        if (this.items.get(coal) > 0) {
                            this.items.remove(coal, 1);
                        }

                        this.fuelTimer -= 60;
                    }
                }
            },
            generator
        )
    );
});