from pathlib import Path
from django.conf import settings

from gtts import gTTS


class AudioFileGenerator:
    __filename = ""
    __file_full_path = ""
    __audio_file_text = ""
    __tts = gTTS

    def get_filename(self):
        return self.__filename

    def get_full_path(self):
        return self.__file_full_path

    def get_text(self):
        return self.__audio_file_text

    def generate_audio_file(self, path, filename, text=""):
        self.__audio_file_text = text
        self.__file_full_path = f"{settings.STATIC_DIR}/{path}/{filename}"

        Path(f"{settings.STATIC_DIR}/{path}").mkdir(parents=True, exist_ok=True)

        self.__tts = gTTS(text, lang='fr')

        self.__filename = f'/static/{path}/{filename}'
        return self.__save()

    def __save(self):
        self.__tts.save(self.__file_full_path)  # type: ignore
        return self.__filename
