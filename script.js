// =====================================================
// KIDICO ENGLISH - GOOGLE SHEETS FORM SİSTEMİ
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyyf4PJOw5R877UPC01ilECYJzV8fpJxDv1Ft2Ih01-jpyA_biF7p43N_VWrC_5zz_C/exec";


// =====================================================
// FORM VERİSİNİ GOOGLE SHEETS'E GÖNDER
// =====================================================

function sendToGoogleSheets(data) {

    return fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
    });

}


// =====================================================
// FORMU İŞLE
// =====================================================

function handleForm(form, formType) {

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Formdaki alanları bul
        const inputs = form.querySelectorAll("input");
        const select = form.querySelector("select");

        let fullName = "";
        let childAge = "";
        let phoneNumber = "";
        let lessonType = "";

        // Input sırasına göre al
        if (inputs[0]) {
            fullName = inputs[0].value.trim();
        }

        if (inputs[1]) {
            childAge = inputs[1].value.trim();
        }

        if (inputs[2]) {
            phoneNumber = inputs[2].value.trim();
        }

        if (select) {
            lessonType = select.value;
        }


        // Kontrol
        if (
            fullName === "" ||
            childAge === "" ||
            phoneNumber === "" ||
            lessonType === ""
        ) {

            alert("Lütfen tüm alanları doldurun.");

            return;
        }

        // Online ders için minimum yaş kontrolü
        if (lessonType === "online" && Number(childAge) < 6) {
            alert("Online dersler için çocuğunuzun yaşı en az 6 olmalıdır.");
            return;
 }


        // Ders tipi
        let lessonText;

        if (lessonType === "online") {
            lessonText = "Online";
        } else {
            lessonText = "Yüz Yüze";
        }


        // Google Sheets'e gönderilecek veri
        const data = {

            fullName: fullName,

            childAge: childAge,

            phoneNumber: phoneNumber,

            lessonType: lessonText,

            formType: formType

        };


        // Gönderiliyor mesajı
        alert(
            "Başvurunuz gönderiliyor...\n\n" +
            "Lütfen bekleyin."
        );


        try {

            await sendToGoogleSheets(data);


            // Başarılı
            alert(
                "Teşekkürler " +
                fullName +
                "!\n\n" +
                "Başvurunuz başarıyla alınmıştır.\n" +
                "En kısa sürede sizinle iletişime geçeceğiz."
            );


            form.reset();


        } catch (error) {

            console.error(
                "Form gönderme hatası:",
                error
            );

            alert(
                "Bir hata oluştu.\n\n" +
                "Lütfen tekrar deneyin."
            );

        }

    });

}


// =====================================================
// DENEME DERSİ FORMU
// =====================================================

// Önce registerForm'u kontrol et
const registerForm =
    document.getElementById("registerForm");


// Sonra trialForm'u kontrol et
const trialForm =
    document.getElementById("trialForm");


// Hangisi varsa onu çalıştır
if (registerForm) {

    handleForm(
        registerForm,
        "Deneme Dersi"
    );

} else if (trialForm) {

    handleForm(
        trialForm,
        "Deneme Dersi"
    );

}


// =====================================================
// HEMEN BAŞLAYIN FORMU
// =====================================================

const startForm =
    document.getElementById("startForm");


if (startForm) {

    handleForm(
        startForm,
        "Hemen Başlayın"
    );

}


// =====================================================
// MINI FORM
// =====================================================

const miniForm =
    document.querySelector(".mini-form");


if (
    miniForm &&
    miniForm !== registerForm &&
    miniForm !== trialForm &&
    miniForm !== startForm
) {

    handleForm(
        miniForm,
        "Deneme Dersi"
    );

}

const lessonSelects = document.querySelectorAll("#lessonType");

lessonSelects.forEach(function (select) {

    select.addEventListener("change", function () {

        const form = select.closest("form");

        if (!form) return;

        const districtField =
            form.querySelector(".district-field");

        const districtInput =
            form.querySelector("#district");

        if (!districtField) return;

        if (select.value === "face") {

            districtField.style.display = "block";

            if (districtInput) {
                districtInput.required = true;
            }

        } else {

            districtField.style.display = "none";

            if (districtInput) {
                districtInput.required = false;
                districtInput.value = "";
            }
        }
    });
});