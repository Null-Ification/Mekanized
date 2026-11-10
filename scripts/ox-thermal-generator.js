Events.on(EventType.ModContentLoadEvent, () => {
    const generator = Vars.content.block(
        "mekanized-ox-thermal-generator"
    );

    const coal = Vars.content.item(
        "mekanized-ox-coal"
    );

    const Bar = Packages.mindustry.ui.Bar;
    const Pal = Packages.mindustry.graphics.Pal;

    const Prov = Packages.arc.func.Prov;
    const Func = Packages.arc.func.Func;
    const Floatp = Packages.arc.func.Floatp;

    generator.addBar(
        "efficiency",
        new JavaAdapter(Func, {
            get: function(build) {
                return new Bar(
                    new JavaAdapter(Prov, {
                        get: function() {
                            return "Efficiency: " +
                                Math.round(build.productionEfficiency * 100) + "%";
                        }
                    }),

                    new JavaAdapter(Prov, {
                        get: function() {
                            return Pal.powerBar;
                        }
                    }),

                    new JavaAdapter(Floatp, {
                        get: function() {
                            return Mathf.clamp(
                                build.productionEfficiency / 4
                            );
                        }
                    })
                );
            }
        })
    );

    const Block = Packages.mindustry.world.Block;

    const field = Block["class"].getDeclaredField("barMap");
    field.setAccessible(true);

    const barMap = field.get(generator);

    const keys = barMap.orderedKeys().toArray();
    const values = [];

    for (let i = 0; i < keys.length; i++) {
        values.push(barMap.get(keys[i]));
    }

    barMap.clear();

    const desiredOrder = ["health", "efficiency", "power"];

    for (let i = 0; i < desiredOrder.length; i++) {
        const index = keys.indexOf(desiredOrder[i]);

        if (index != -1) {
            barMap.put(keys[index], values[index]);
        }
    }

    for (let i = 0; i < keys.length; i++) {
        if (desiredOrder.indexOf(keys[i]) == -1) {
            barMap.put(keys[i], values[i]);
        }
    }

    generator.buildType = prov(() =>
        new JavaAdapter(
            ThermalGenerator.ThermalGeneratorBuild,
            {
                fuelTimer: 0,

                acceptItem: function(source, item) {
                    return item == coal && this.items.get(coal) < 10;
                },

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