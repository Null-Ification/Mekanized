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
                    const Stat =
                        Packages.mindustry.world.meta.Stat;

                    const StatValue =
                        Packages.mindustry.world.meta.StatValue;

                    const StatValues =
                        Packages.mindustry.world.meta.StatValues;

                    const Table =
                        Packages.arc.scene.ui.layout.Table;

                    const Styles =
                        Packages.mindustry.ui.Styles;

                    // INPUT: common Coal ingredient.
                    stats.add(
                        Stat.input,
                        new JavaAdapter(StatValue, {
                            display: function(table) {
                                table.add(
                                    StatValues.displayItem(coal, 1, 120, true)
                                ).left();
                            }
                        })
                    );

                    // OUTPUT: custom recipe cards.
                    stats.add(
                        Stat.output,
                        new JavaAdapter(StatValue, {
                            display: function(table) {
                                table.defaults().left();

                                // Iron recipe
                                const ironRecipe = new Table(Styles.grayPanel);
                                ironRecipe.margin(8);

                                ironRecipe.add(
                                    StatValues.displayItem(rawIron, 1, 120, true)
                                ).left();

                                ironRecipe.add(" > ").padLeft(8).padRight(8);

                                ironRecipe.add(
                                    StatValues.displayItem(iron, 1, 120, true)
                                ).left();

                                // Copper recipe
                                const copperRecipe = new Table(Styles.grayPanel);
                                copperRecipe.margin(8);

                                copperRecipe.add(
                                    StatValues.displayItem(rawCopper, 1, 120, true)
                                ).left();

                                copperRecipe.add(" > ").padLeft(8).padRight(8);

                                copperRecipe.add(
                                    StatValues.displayItem(copper, 1, 120, true)
                                ).left();

                                // Put both recipe cards inside a vertical container.
                                const recipes = new Table();
                                recipes.defaults().left();

                                recipes.add(ironRecipe)
                                    .width(320)
                                    .height(72)
                                    .padBottom(6)
                                    .row();

                                recipes.add(copperRecipe)
                                    .width(320)
                                    .height(72)
                                    .row();

                                // Add the container to the stats table.
                                table.add(recipes).left().row();
                            }
                        })
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