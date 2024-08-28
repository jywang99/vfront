<script>
  import { axio } from "$lib/api";
  import { localUser } from "$lib/storable";

  /**
   * @param {SubmitEvent} event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    if (form == null || !(form instanceof HTMLFormElement)) {
      return;
    }
    const formData = new FormData(form);

    const email = formData.get('email');
    const password = formData.get('password');

    axio.post('/login', { email, password }).then((res) => {
      const data = res.data;
      localUser.set({
        token: data.token,
        name: data.username,
      })
      window.location.href = '/';
    }).catch((err) => {
      console.error(err);
    });
  }
</script>

<h1>Login</h1>

<form on:submit={handleSubmit}>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />
  <br />

  <label for="password">Password</label>
  <input type="password" id="password" name="password" required />
  <br />

  <button type="submit">Login</button>
  <a href="/regist">Sign up</a>
</form>

