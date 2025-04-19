<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ReleaseCategory
 * 
 * @property int $ReleaseCategoryID
 * @property string $Name
 * @property int|null $UserID
 * @property Carbon|null $CreatedAt
 * 
 * @property User|null $user
 * @property Collection|Song[] $songs
 *
 * @package App\Models
 */
class ReleaseCategory extends Model
{
	protected $table = 'ReleaseCategory';
	protected $primaryKey = 'ReleaseCategoryID';
	public $timestamps = false;

	protected $casts = [
		'UserID' => 'int',
		'CreatedAt' => 'datetime'
	];

	protected $fillable = [
		'Name',
		'UserID',
		'CreatedAt'
	];

	public function user()
	{
		return $this->belongsTo(User::class, 'UserID');
	}

	public function songs()
	{
		return $this->hasMany(Song::class, 'ReleaseCategoryID');
	}
}
