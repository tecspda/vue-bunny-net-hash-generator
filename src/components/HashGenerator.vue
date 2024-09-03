<template>
  <div class="container mt-5">
    <h2 class="mb-4">Hash Generator for Bunny.net CDN files</h2>
    <form @submit.prevent="generateHash">
      <div class="form-group">
        <label for="token_security_key">Token Security Key:</label>
        <input
          v-model="tokenSecurityKey"
          id="token_security_key"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="signed_url">Signed URL:</label>
        <input
          v-model="signedUrl"
          id="signed_url"
          class="form-control"
          required
        />
      </div>
      <div class="form-group">
        <label for="expiration">Expiration (год):</label>
        <input
          v-model="expiration"
          type="date"
          id="expiration"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Generate Hash</button>
    </form>
    <div v-if="hash" class="mt-4">
      <h3>Generated Hash-Link:</h3>
      <h5 class="alert alert-success">
        Link: <a :href="hash" target="_blank">click</a>
      </h5>
    </div>
    <div v-if="expirationTimestamp">
      <h3>Expiration Timestamp (JavaScript Number):</h3>
      <p>{{ expirationTimestamp }}</p>
    </div>
  </div>
</template>

<script>
import { signUrl as convert } from '@/assets/js/token';

export default {
  data() {
    return {
      tokenSecurityKey: "",
      signedUrl: "",
      expiration: "",
      hash: "",
      expirationTimestamp: null,
    };
  },
  methods: {
    generateHash() {
      // Преобразование даты в год (число)
      const expirationDate = new Date(this.expiration);
      const expirationYear = expirationDate.getFullYear();

      // Преобразование года в дату и вычисление таймстампа
      this.expirationTimestamp = expirationDate.getTime() / 1000; // Переводим в секунды, чтобы использовать в функции convert
      const expirationTimestampInDays = Math.floor(this.expirationTimestamp / 86400); // Переводим в дни, чтобы использовать в функции convert

      // Проверка на допустимый диапазон года
      if (expirationYear < 2024 || expirationYear > 2500) {
        alert("Expiration должно быть в пределах 2024-2500 года");
        return;
      }
      
      // Генерация хеша
      this.hash = convert(this.signedUrl, this.tokenSecurityKey, expirationTimestampInDays, '', false, '/', '', '');
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
