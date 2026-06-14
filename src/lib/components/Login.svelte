<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let name = "";
  let error = "";

  const isGithubPages = window.location.hostname.includes("github.io");
  const basePath = isGithubPages
    ? `/${window.location.pathname.split('/')[1]}`
    : "";

  const sfx = {
    correct:   new Audio(`${basePath}/static/sounds/correct.mp3`),
    lowercase: new Audio(`${basePath}/static/sounds/lowercase.mp3`),
    uppercase: new Audio(`${basePath}/static/sounds/uppercase.mp3`),
    mixed:     new Audio(`${basePath}/static/sounds/mixed.mp3`),
    unknown:   new Audio(`${basePath}/static/sounds/unknown.mp3`)
  };


  Object.values(sfx).forEach(sound => {
    sound.load();
    sound.volume = 0.4; // optional, but recommended
  });


  const wrongCaseMessages = {
    lowercase: [
      "Remember the capital letter!",
      "Names start with big letters, silly!",
      "Try again… with a capital letter this time."
    ],
    uppercase: [
      "You write your name in ALL CAPS?",
      "WHOA THERE, EASY ON THE SHIFT KEY.",
      "Try normal letters, buddy."
    ],
    mixed: [
      "That doesn’t look like your name.",
      "Try writing it the way YOU write it.",
      "Hmm… that’s not quite right."
    ],
    unknown: [
      "I DON'T KNOW WHO THAT IS!",
      "NOPE!",
      "WHAT ARE YOU TYPING?!",
      "TRY AGAIN, MYSTERY HUMAN!",
      "THAT'S NOT A REAL NAME!",
      "ARE YOU EVEN TRYING?"
    ]
  };

  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function checkName() {
    const trimmed = name.trim();

    // Correct names
    if (trimmed === "Jonah") {
      sfx.correct.play();
      setTimeout(() => {
        dispatch("login", { profile: "jonah" });
      }, 150);
      return;
    }
    if (trimmed === "Kieran") {
      sfx.correct.play();
      setTimeout(() => {
        dispatch("login", { profile: "kieran" });
      }, 150);
      return;
    }

    const lower = trimmed.toLowerCase();

    // ALL CAPS (must come BEFORE lowercase check)
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 1) {
      sfx.uppercase.play();
      setTimeout(() => {
        error = random(wrongCaseMessages.uppercase);
      }, 300);
      return;
    }

     // Mixed weird case
    if (trimmed !== trimmed.toLowerCase() && trimmed !== trimmed.toUpperCase()) {
      sfx.mixed.play();
      setTimeout(() => {
        error = random(wrongCaseMessages.mixed);
      }, 300);
        return;
    }
    
    // Wrong but recognizable (lowercase)
    if (lower === "jonah" || lower === "kieran") {
      sfx.lowercase.play();
      setTimeout(() => {
        error = random(wrongCaseMessages.lowercase);
      }, 300);
      return;
    }

    // Everything else
    setTimeout(() => {
      error = random(wrongCaseMessages.unknown);
    }, 300);
    sfx.unknown.play();
  }

</script>

<div class="login-container">
  <div class="login-box">
    <h1 class="title">WHO ARE YOU?</h1>

    <input
      class="name-input"
      bind:value={name}
      placeholder="Type your name…"
      on:keydown={(e) => e.key === "Enter" && checkName()}
    />

    {#if error}
      <div class="error">{error}</div>
    {/if}

    <button class="enter-btn" on:click={checkName}>
      Enter
    </button>
  </div>
</div>

<style>
  .login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #401a60, #b365f2);
    font-family: "Inter", system-ui, sans-serif;
  }

  .login-box {
    background: #401a60;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 10px 15px rgba(0,0,0,0.60);
    text-align: center;
    width: 90%;
    max-width: 600px;
    animation: fadeIn 0.4s ease-out;
  }

  .title {
    font-size: 4rem;
    margin-bottom: 2.5rem;
    color: #ffffff;
  }

  .name-input {
    width: 90%;
    padding: 1rem;
    font-size: 1.2rem;
    border-radius: 12px;
    border: 2px solid #ccc;
    outline: none;
    transition: 0.2s;
  }

  .name-input:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.25);
  }

  .error {
    margin-top: 2rem;
    font-size: 2rem;
    color: #d9534f;
    font-weight: 600;
    animation: shake 0.3s ease-out;
  }

  .enter-btn {
    margin-top: 2rem;
    width: 100%;
    padding: 0.75rem;
    font-size: 1.2rem;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.2s;
  }

  .enter-btn:hover {
    background: #3a78c2;
    transform: translateY(-2px);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-4px); }
    100% { transform: translateX(0); }
  }
</style>
