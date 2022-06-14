<script lang="ts">
  import { onDestroy } from 'svelte';
  import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

  const restrict = false;
  let scanActive = false;
  let scanResult: string | undefined;

  const checkPermission = async () => {
    // check if user already granted permission
    const status = await BarcodeScanner.checkPermission({ force: false });

    if (status.granted) {
      // user granted permission
      return true;
    }

    if (status.denied) {
      // user denied permission
      return false;
    }

    if (status.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (status.neverAsked) {
      // user has not been requested this permission before
      // it is advised to show the user some sort of prompt
      // this way you will not waste your only chance to ask for the permission
      const c = confirm('We need your permission to use your camera to be able to scan barcodes');
      if (!c) {
        return false;
      }
    }

    if (status.restricted || status.unknown) {
      // ios only
      // probably means the permission has been denied
      return false;
    }

    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest = await BarcodeScanner.checkPermission({ force: true });

    if (statusRequest.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (statusRequest.granted) {
      // the user did grant the permission now
      return true;
    }

    // if (status.denied) {
    //   // On Android this will happen only when the user checks the box "never ask again"
    //   BarcodeScanner.openAppSettings();
    // }

    // user did not grant the permission, so (s)he must have declined the request
    return false;
  };

  // Speed-up subsequent startScanner()
  const prepareScanner = () => {
    BarcodeScanner.prepare();
  };

  const startScanner = async () => {
    const allowed = await checkPermission();

    if (allowed) {
      scanActive = true;
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan(
        restrict ? { targetedFormats: [SupportedFormat.QR_CODE] } : {}
      );

      if (result.hasContent) {
        scanActive = false;
        // alert(result.content); //The QR content will come out here
        scanResult = result.content;
        //Handle the data as your heart desires here
      } else {
        scanActive = false;
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  };

  const stopScanner = () => {
    if (scanActive) {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
      scanActive = false;
    }
  };

  onDestroy(stopScanner);
</script>

<section>
  <h1>QR Scanner</h1>
  {#if scanActive}
    <button class="stop-button" on:click={stopScanner}>Stop</button>
    <div class="scan-box" />
  {:else}
    <button class="scan-button" on:click={startScanner}>Scan</button>
  {/if}
  <div><p>{scanResult}</p></div>
</section>

<style>
  :global(html) {
    background: transparent;
  }
  :global(body) {
    background-image: none;
  }
  .scan-box {
    border: 2px solid #fff;
    box-shadow: 0 0 0 100vmax rgb(0, 0, 0, 0.5);
    content: '';
    display: block;
    left: 50%;
    height: 300px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
  }
  .scan-button {
    margin: 0px;
    position: absolute;
    bottom: 100px;
    width: 100vw;
    height: 50px;
    z-index: 11;
  }
</style>
