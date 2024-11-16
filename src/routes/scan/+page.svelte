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
    const data = await res.json();
    if (data?.book) {
      await goto(`/books/${data.book.id}`);
    }
  };
</script>

<Barcode onDetected={handleCode} />
