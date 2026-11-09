print("Block count: " + Vars.content.blocks().size);

Vars.content.blocks().each(block => {
    if (block.name.indexOf("mekanized") !== -1) {
        print("Found block: " + block.name);
    }
});