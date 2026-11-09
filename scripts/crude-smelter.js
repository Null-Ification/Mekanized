Events.on(EventType.ModContentLoadEvent, () => {
    const smelter = Vars.content.block(
        "mekanized-crude-smelter"
    );

    const rawIron = Vars.content.item(
        "mekanized-ox-raw-iron"
    );

    const iron = Vars.content.item(
        "mekanized-ox-iron"
    );

    const rawCopper = Vars.content.item(
        "mekanized-ox-raw-copper"
    );

    const copper = Vars.content.item(
        "mekanized-ox-copper"
    );

    const coal = Vars.content.item(
        "mekanized-ox-coal"
    );

    const craftTime = 120;

    smelter.outputItem = null;

    smelter.outputItems = ItemStack.with(
        iron, 1,
        copper, 1
    );

    smelter.consume(
    new JavaAdapter(
        Packages.mindustry.world.consumers.Consume,
        {
            efficiency: function(build) {
                const hasIron = build.items.get(rawIron) > 0;
                const hasCopper = build.items.get(rawCopper) > 0;
                const hasCoal = build.items.get(coal) > 0;

                return (hasIron || hasCopper) && hasCoal ? 1 : 0;
            },

            display: function(stats) {
                stats.add(
                    Packages.mindustry.world.meta.Stat.input,
                    Packages.mindustry.world.meta.StatValues.string(
                        "1 Raw Iron + 1 Coal -> 1 Iron (2 seconds)"
                    )
                );

                stats.add(
                    Packages.mindustry.world.meta.Stat.input,
                    Packages.mindustry.world.meta.StatValues.string(
                        "1 Raw Copper + 1 Coal -> 1 Copper (2 seconds)"
                    )
                );
            }
        }
    )
);

    smelter.buildType = prov(() =>
        new JavaAdapter(
            GenericCrafter.GenericCrafterBuild,
            {
                acceptItem: function(source, item) {
                    if (item == coal) {
                        return this.items.get(coal) < 10;
                    }

                    if (item == rawIron) {
                        return (
                            this.items.get(rawCopper) == 0 &&
                            this.items.get(rawIron) < 10
                        );
                    }

                    if (item == rawCopper) {
                        return (
                            this.items.get(rawIron) == 0 &&
                            this.items.get(rawCopper) < 10
                        );
                    }

                    return false;
                },

                updateTile: function() {
                    print(
                        "Efficiency: " + this.efficiency +
                        " | Enabled: " + this.enabled +
                        " | Working: " + (this.items.get(rawIron) > 0 ||
                                        this.items.get(rawCopper) > 0)
                    );
                    this.dump(iron);
                    this.dump(copper);

                    let input = null;
                    let output = null;

                    if (this.items.get(rawIron) > 0) {
                        input = rawIron;
                        output = iron;
                    } else if (this.items.get(rawCopper) > 0) {
                        input = rawCopper;
                        output = copper;
                    }

                    if (input != null) {
                        if (
                            this.items.get(coal) > 0 &&
                            this.items.get(output) < 10
                        ) {
                            this.progress += Time.delta;

                            if (this.progress >= craftTime) {
                                this.items.remove(input, 1);
                                this.items.remove(coal, 1);
                                this.items.add(output, 1);

                                this.progress -= craftTime;

                                print(
                                    "Crude Smelter produced " +
                                    output.localizedName + "!"
                                );
                            }
                        }
                    }
                }
            },
            smelter
        )
    );

    print("Crude Smelter multi-recipe system assigned!");
});