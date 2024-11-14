<script>
  import { goto } from "$app/navigation";

  import Barcode from "$lib/components/Barcode.svelte";

  const handleCode = async (isbn) => {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isbn }),
    });
    const book = await res.json();
    if (book) {
      console.log(book);
      await goto("/");
    }
  };
</script>

<Barcode onDetected={handleCode} />
