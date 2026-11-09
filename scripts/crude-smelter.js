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

    const iron = Vars.content.item(
        "mekanized-ox-iron"
    );

    const craftTime = 120;

    smelter.buildType = prov(() =>
        new JavaAdapter(
            GenericCrafter.GenericCrafterBuild,
            {
                acceptItem: function(source, item) {
                    if (this.items.total() >= smelter.itemCapacity) {
                        return false;
                    }

                    if (item == rawIron) {
                        return this.items.get(rawIron) < 10;
                    }

                    if (item == coal) {
                        return this.items.get(coal) < 10;
                    }

                    return false;
                },

                updateTile: function() {
                    // Try to output stored Iron.
                    this.dump(iron);

                    // Check recipe ingredients and output capacity.
                    if (
                        this.items.get(rawIron) > 0 &&
                        this.items.get(coal) > 0 &&
                        this.items.get(iron) < 10
                    ) {
                        this.progress += Time.delta;

                        if (this.progress >= craftTime) {
                            this.items.remove(rawIron, 1);
                            this.items.remove(coal, 1);
                            this.items.add(iron, 1);

                            this.progress -= craftTime;

                            print("Crude Smelter produced Iron!");
                        }
                    }
                }
            },
            smelter
        )
    );

    print("Crude Smelter smelting system assigned!");
});