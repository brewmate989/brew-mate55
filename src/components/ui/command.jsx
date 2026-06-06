<CommandDialog
  open={open}
  onOpenChange={setOpen}
>

  <CommandInput
    placeholder="Cari menu kopi..."
  />

  <CommandList>

    <CommandEmpty>
      Menu tidak ditemukan
    </CommandEmpty>

    <CommandGroup heading="Menu Kopi">

      <CommandItem
        onSelect={() => {
          console.log("Kopi dipilih");
          setOpen(false);
        }}
        className="cursor-pointer rounded-md hover:bg-orange-100"
      >
        ☕ Kopi
      </CommandItem>

      <CommandItem
        onSelect={() => {
          console.log("Latte dipilih");
          setOpen(false);
        }}
        className="cursor-pointer rounded-md hover:bg-orange-100"
      >
        🥛 Latte
      </CommandItem>

    </CommandGroup>

  </CommandList>

</CommandDialog>