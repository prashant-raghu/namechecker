import { Injectable } from '@nestjs/common';
import { FacebookService } from './platforms/facebook/facebook.service';
import { TwitterService } from './platforms/twitter/twitter.service';
import { InstagramService } from './platforms/instagram/instagram.service';
import { YoutubeService } from './platforms/youtube/youtube.service';
import { Observable, merge } from 'rxjs';

@Injectable()
export class SocialsearchService {
    constructor(private facebook:FacebookService, private twitter: TwitterService
        ,private instagram: InstagramService, private youtube: YoutubeService){}

    handler$(username: string):Observable<any>{
        return merge(this.twitter.checkTwitter$(username), this.instagram.checkInstagram$(username),
        this.youtube.checkYoutube$(username));
    }
}
