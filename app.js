const statusPill = document.getElementById("scanStatus");
const cameraHint = document.getElementById("cameraHint");
const target = document.getElementById("catTarget");
const slider = document.getElementById("blendSlider");
const result = document.getElementById("result");
const reveal = document.getElementById("catReveal");
const blendButton = document.getElementById("blendButton");
const resetButton = document.getElementById("resetButton");

let markerVisible = false;

if (target) {
  target.addEventListener("targetFound", () => {
    markerVisible = true;
    statusPill.textContent = "พบบัตรคำแล้ว";
    cameraHint.style.display = "none";
  });
  target.addEventListener("targetLost", () => {
    markerVisible = false;
    statusPill.textContent = "กำลังค้นหาบัตรคำ";
    cameraHint.style.display = "flex";
  });
}

document.querySelectorAll(".letter-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const audioPath = `./assets/audio/${button.dataset.audio}`;
    try {
      const audio = new Audio(audioPath);
      audio.onerror = () => speakFallback(button.dataset.fallback);
      await audio.play();
    } catch (error) {
      speakFallback(button.dataset.fallback);
    }
  });
});

function speakFallback(text) {
  // สำรองไว้สำหรับทดสอบ UI เท่านั้น: เสียงสังเคราะห์อาจไม่ใช่เสียง phoneme ที่ถูกต้อง
  if (!("speechSynthesis" in window)) {
    result.textContent = "ยังไม่มีไฟล์เสียง กรุณาเพิ่มไฟล์ MP3 ในโฟลเดอร์ assets/audio";
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.72;
  window.speechSynthesis.speak(utterance);
}

slider.addEventListener("input", () => {
  const stage = Number(slider.value);
  const prompts = [
    "เริ่มที่ C — ออกเสียง /k/",
    "เลื่อนไปที่ A — ออกเสียง /æ/ แล้วต่อเสียง",
    "ถึง T — ออกเสียง /t/ แล้วลองผสมเสียงทั้งหมด"
  ];
  result.textContent = prompts[stage];
  if (stage < 2) reveal.classList.add("hidden");
});

blendButton.addEventListener("click", () => {
  if (Number(slider.value) !== 2) {
    result.textContent = "ลองเลื่อนจาก C ไป A แล้วไป T ให้ครบก่อนนะ";
    return;
  }
  reveal.classList.remove("hidden");
  result.textContent = "เยี่ยมมาก! ลองพูดเสียง /k/ + /æ/ + /t/ ต่อกันเป็นคำว่า CAT";
});

resetButton.addEventListener("click", () => {
  slider.value = "0";
  reveal.classList.add("hidden");
  result.textContent = "เมื่อพร้อมแล้ว ให้ลองพูดเสียง /k/ /æ/ /t/ ต่อกัน";
});

// หมายเหตุ: การแสดงผลและการลากตัวเลื่อนเป็นเพียงกิจกรรมฝึก
// ครูควรประเมินการอ่านออกเสียงจริงเป็นรายบุคคล ไม่ใช้การลากสำเร็จแทนคะแนนการอ่าน
