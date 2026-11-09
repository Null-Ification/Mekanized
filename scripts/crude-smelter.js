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

    // Kiln slops
    const DrawMulti = Packages.mindustry.world.draw.DrawMulti;
    const DrawDefault = Packages.mindustry.world.draw.DrawDefault;
    const DrawFlame = Packages.mindustry.world.draw.DrawFlame;

    smelter.drawer = new DrawMulti(
        new DrawDefault(),
        new DrawFlame(Color.valueOf("ffc099"))
    );

    smelter.outputItem = null;
    smelter.outputItems = ItemStack.with();

    smelter.consume(
        new JavaAdapter(
            Packages.mindustry.world.consumers.Consume,
            {
                efficiency: function(build) {
                    const hasIron = build.items.get(rawIron) > 0;
                    const hasCopper = build.items.get(rawCopper) > 0;
                    const hasCoal = build.items.get(coal) > 0;

                    const ironFull = build.items.get(iron) >= 10;
                    const copperFull = build.items.get(copper) >= 10;

                    const outputFull =
                        (hasIron && ironFull) ||
                        (hasCopper && copperFull);

                    return (hasIron || hasCopper) && hasCoal && !outputFull ? 1 : 0;
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

                    // INPUT
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

                                const recipes = new Table();
                                recipes.defaults().left();

                                recipes.add(ironRecipe)
                                    .growX()
                                    .padBottom(6)
                                    .row();

                                recipes.add(copperRecipe)
                                    .growX()
                                    .row();

                                table.row();

                                // Add the recipe cards
                                table.add(recipes)
                                    .growX()
                                    .left()
                                    .row();
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

                    const canSmelt =
                        input != null &&
                        this.items.get(coal) > 0 &&
                        this.items.get(output) < 10;

                    this.warmup = Mathf.approach(
                        this.warmup,
                        canSmelt ? 1 : 0,
                        0.02 * Time.delta
                    );

                    if (canSmelt) {
                        this.progress += Time.delta;

                        if (this.progress >= craftTime) {
                            this.items.remove(input, 1);
                            this.items.remove(coal, 1);
                            this.items.add(output, 1);

                            const effectColor = output == iron
                                ? Color.valueOf("ffc099")
                                : Color.valueOf("e58b4a");

                            Fx.mine.at(this.x, this.y, effectColor);

                            this.progress -= craftTime;
                        }
                    }
                }
            },
            smelter
        )
    );
});