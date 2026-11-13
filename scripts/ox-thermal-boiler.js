Events.on(EventType.ModContentLoadEvent, () => {
    const boiler = Vars.content.block(
        "mekanized-ox-thermal-boiler"
    );

    boiler.outputItems = ItemStack.with();
});