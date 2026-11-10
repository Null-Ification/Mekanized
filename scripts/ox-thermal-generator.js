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
                                Math.round(build.getActualEfficiency() * 100) + "%";
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
                                build.getActualEfficiency() / 4
                            );
                        }
                    })
                );
            }
        })
    );

    generator.buildType = prov(() =>
        new JavaAdapter(
            ThermalGenerator.ThermalGeneratorBuild,
            {
                fuelTimer: 0,
                fuelActive: false,

                getActualEfficiency: function() {
                    return this.productionEfficiency +
                        (this.fuelActive ? 0.75 : 0);
                },

                acceptItem: function(source, item) {
                    return item == coal && this.items.get(coal) < 10;
                },

                getPowerProduction: function() {
                    const actual = this.getActualEfficiency();

                    return this.enabled
                        ? generator.powerProduction * Math.min(actual, 3)
                        : 0;
                },

                updateTile: function() {
                    this.super$updateTile();

                    this.fuelActive = this.items.get(coal) > 0;

                    if (this.fuelActive) {
                        this.fuelTimer += Time.delta;

                        if (this.fuelTimer >= 60) {
                            this.items.remove(coal, 1);
                            this.fuelTimer -= 60;
                        }
                    } else {
                        this.fuelTimer = 0;
                    }

                    const actual = this.getActualEfficiency();

                    if (actual > 4) {
                        this.damage(
                            this.maxHealth * 0.1 * Time.delta / 60
                        );
                    }
                }
            },
            generator
        )
    );
});